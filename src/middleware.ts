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
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      // Not logged in — redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      if (!ADMIN_ROLES.includes(role)) {
        // Logged in but not an admin — redirect to homepage, NOT admin
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Invalid/expired token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For the root "/" — never redirect to admin even if admin is logged in
  // The homepage is the storefront, always accessible
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
