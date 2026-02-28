import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Middleware for ConvertHub.
 *
 * Protects dashboard and admin API routes at the server level.
 * Redirects unauthenticated users to /login.
 */

// Routes that require authentication
const protectedPaths = [
    "/dashboard",
    "/checkout",
];

// API routes that require authentication
const protectedApiPaths = [
    "/api/users",
    "/api/transactions",
];

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Check if path is protected
    const isProtectedPage = protectedPaths.some(p => pathname.startsWith(p));
    const isProtectedApi = protectedApiPaths.some(p => pathname.startsWith(p));

    // If not authenticated and accessing protected route
    if (!req.auth) {
        if (isProtectedPage) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (isProtectedApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/checkout/:path*",
        "/api/users/:path*",
        "/api/transactions/:path*",
    ],
};
