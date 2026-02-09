import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/"];

const AUTH_ROUTES = ["/login", "/register"];

// Admin-only routes (teacher/admin access)
const ADMIN_ROUTES = ["/dashboard-admin"];

// Student-only routes
const STUDENT_ROUTES = ["/dashboard", "/courses", "/team", "/cbt"];

type UserRole = "teacher" | "student" | "admin";

function decodeJwtPayload(token: string): { RoleName?: string; UserType?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Get user role from JWT token
 */
function getUserRole(token: string): UserRole | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // Check RoleName first, then UserType
  const role = (payload.RoleName || payload.UserType || "").toLowerCase();

  if (role === "teacher" || role === "admin") return "teacher";
  if (role === "student") return "student";

  return null;
}

/**
 * Check if pathname starts with any of the given routes
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/api/")
  );

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // Redirect unauthenticated users to login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (token && isAuthRoute) {
    const role = getUserRole(token);
    // Redirect based on role
    if (role === "teacher") {
      return NextResponse.redirect(new URL("/dashboard-admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Role-based route protection
  if (token) {
    const role = getUserRole(token);

    // Block students from accessing admin routes
    if (role === "student" && matchesRoute(pathname, ADMIN_ROUTES)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Block teachers/admins from accessing student-only routes
    if (role === "teacher" && matchesRoute(pathname, STUDENT_ROUTES)) {
      return NextResponse.redirect(new URL("/dashboard-admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts|api).*)"],
};
