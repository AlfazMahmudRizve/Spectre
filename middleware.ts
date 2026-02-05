import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware disabled to prevent any edge-case redirect loops.
// Auth checks are now handled per-page (e.g. in /dashboard/page.tsx).
export function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [],
}
