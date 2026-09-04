import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);
const COOKIE_NAME = process.env.COOKIE_NAME || "nt_session";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "ORDER_MANAGER", "PRODUCT_MANAGER"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow /admin/login to be accessed without a session
    if (pathname === "/admin/login") {
      // If already logged in as admin, redirect to dashboard
      const token = request.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, JWT_SECRET);
          if (ADMIN_ROLES.includes(payload.role as string)) {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        } catch {
          // Invalid token — let them see the login page
        }
      }
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      // Not logged in — redirect to admin login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      if (!ADMIN_ROLES.includes(role)) {
        // Logged in but not an admin — redirect to homepage
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Invalid/expired token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
