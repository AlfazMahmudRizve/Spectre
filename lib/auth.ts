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

                const user = await getUserByEmail(credentials.email);

                // Simple password check (In production use bcrypt)
                if (user && user.password === credentials.password) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        // @ts-ignore
                        role: user.role
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
                const dbUser = await getUserByEmail(user.email!);
                token.role = dbUser?.role || "customer";
                token.id = dbUser?.id;
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
