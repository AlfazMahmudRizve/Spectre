import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

// export const config = { matcher: ["/dashboard"] }
// Temporarily disabling middleware protection to debug session issues
export const config = { matcher: [] }
