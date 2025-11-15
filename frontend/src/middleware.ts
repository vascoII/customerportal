import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/api", // API routes are handled by the backend
  "/_next", // Next.js internal routes
  "/favicon.ico",
  "/images", // Static images
];

/**
 * Check if a path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Check if a path is an auth route (login/signup)
 */
function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/signin") || pathname.startsWith("/signup");
}

/**
 * Next.js Middleware for authentication
 * 
 * This middleware runs on the Edge Runtime and checks for the PHPSESSID cookie.
 * If the cookie is missing and the user is trying to access a protected route,
 * they are redirected to the signin page.
 * 
 * Note: The actual session validation is done by the Symfony backend API.
 * This middleware only checks for the presence of the cookie.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const phpsessid = request.cookies.get("PHPSESSID");

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // If user is on auth page and has a session cookie, redirect to dashboard
  if (isAuthRoute(pathname) && phpsessid) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If user doesn't have a session cookie and is trying to access a protected route
  if (!phpsessid && !isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    // Store the original URL to redirect after login
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 * 
 * Matches all routes except:
 * - API routes (handled by Symfony backend)
 * - Next.js internal routes (_next, static files)
 * - Static files (images, favicon, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};

