import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const sellerRoutes = ["/dashboard", "/vendeur"];
const adminRoutes = ["/admin"];
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isSellerRoute = sellerRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isHome = pathname === "/";

  if (isHome) {
    return NextResponse.redirect(new URL("/buyer", request.url));
  }

  // Protected routes - require seller/admin login
  if ((isSellerRoute || isAdminRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Public routes - redirect to store if authenticated
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/buyer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|file\\.svg|globe\\.svg|next\\.svg|vercel\\.svg|window\\.svg).*)",
  ],
};
