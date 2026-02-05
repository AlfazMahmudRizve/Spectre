
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // If we get here, the user is authenticated (token exists)
        // Check if role is admin
        if (req.nextauth.token?.role !== "admin") {
            // Log for debugging (server-side)
            console.log("Middleware: Non-admin trying to access dashboard. Redirecting to Home.");
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
)

export const config = { matcher: ["/dashboard"] }
