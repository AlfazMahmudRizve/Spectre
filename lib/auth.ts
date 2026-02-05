import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, createUser } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // 1. Try DB Lookup
                try {
                    const user = await getUserByEmail(credentials.email);
                    if (user && user.password === credentials.password) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            // @ts-ignore
                            role: user.role
                        };
                    }
                } catch (e) {
                    console.error("DB Auth Failed:", e);
                }

                // 2. Failsafe: Hardcoded Admin (for serverless environments where local file DB might fail)
                if (credentials.email === 'admin@spectre.net' && credentials.password === 'ghost') {
                    return {
                        id: 'master-admin',
                        name: 'Commander',
                        email: 'admin@spectre.net',
                        role: 'admin'
                    };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' && user.email) {
                const existingUser = await getUserByEmail(user.email);
                if (!existingUser) {
                    await createUser({
                        email: user.email,
                        name: user.name || 'Operative',
                        role: 'customer',
                        provider: 'google'
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                // Initial sign in
                token.id = user.id;

                // FORCE ADMIN ROLE FOR MASTER EMAIL
                if (user.email?.toLowerCase() === 'admin@spectre.net') {
                    token.role = 'admin';
                } else {
                    // Try DB for others, fallback to customer
                    try {
                        const dbUser = await getUserByEmail(user.email!);
                        token.role = dbUser?.role || "customer";
                        token.id = dbUser?.id || token.id;
                    } catch (e) {
                        console.error("JWT DB Lookup Failed", e);
                        token.role = "customer"; // Default to customer on error
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.id = token.id;
            }
            return session;
        }
    }
};
