import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Check if user is trying to access dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check for admin-only routes
    if (pathname.startsWith("/dashboard/admin")) {
      if (userRole !== "ADMIN") {
        // Redirect non-admin users to main dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
