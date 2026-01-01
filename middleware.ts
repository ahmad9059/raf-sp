import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Map department IDs to their dashboard routes
const departmentDashboardRoutes: Record<string, string> = {
  "mri": "/dashboard/mri",
  "amri": "/dashboard/amri",
  "food-science": "/dashboard/food-science",
  "cri": "/dashboard/cri",
  "flori": "/dashboard/floriculture",
  "rari": "/dashboard/rari",
  "mnsuam": "/dashboard/mnsuam",
  "soil-water": "/dashboard/soil-water",
  "pest": "/dashboard/pesticide",
  "agri-eng": "/dashboard/agri-engineering",
  "raedc": "/dashboard/raedc",
  "agri-ext": "/dashboard/agri-extension",
  "erss": "/dashboard/entomology",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;
  const userDepartmentId = req.auth?.user?.departmentId;

  // Check if user is trying to access dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect department heads to their specific dashboard
    if (
      pathname === "/dashboard" &&
      userRole === "DEPT_HEAD" &&
      userDepartmentId &&
      departmentDashboardRoutes[userDepartmentId]
    ) {
      return NextResponse.redirect(new URL(departmentDashboardRoutes[userDepartmentId], req.url));
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
      // Redirect department heads to their specific dashboard
      if (userRole === "DEPT_HEAD" && userDepartmentId && departmentDashboardRoutes[userDepartmentId]) {
        return NextResponse.redirect(new URL(departmentDashboardRoutes[userDepartmentId], req.url));
      }
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
