import { NextRequest, NextResponse } from "next/server";
import {
  validateApiAccess,
  generateInternalToken,
  verifyInternalToken,
  COOKIE_NAME,
} from "./app/lib/security";
import {
  checkRateLimit,
  checkRouteRateLimit,
  blockedReferrerResponse,
  rateLimitResponse,
  getClientIp,
  isBlockedReferrer,
  isLocalTraffic,
} from "./app/lib/rateLimit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block known abusive referrer origins (spoofed referer spam / scraper sites)
  if (isBlockedReferrer(request)) {
    return blockedReferrerResponse();
  }

  // Per-IP burst + sustained rate limiting to blunt scraper traffic
  if (!isLocalTraffic(request)) {
    const ip = getClientIp(request);

    const routeLimit = checkRouteRateLimit(pathname, ip);
    if (routeLimit.matched && !routeLimit.allowed) {
      return rateLimitResponse(routeLimit.retryAfterSeconds);
    }

    const globalLimit = checkRateLimit(ip);
    if (!globalLimit.allowed) {
      return rateLimitResponse(globalLimit.retryAfterSeconds);
    }
  }

  // Protect internal API endpoints from external leeching and hotlinking
  if (pathname.startsWith("/api/")) {
    const check = await validateApiAccess(request);
    if (!check.allowed) {
      return check.response;
    }
    return NextResponse.next();
  }

  // For regular HTML page visits, ensure the browser receives a valid signed session token
  const response = NextResponse.next();
  const existingToken = request.cookies.get(COOKIE_NAME)?.value;
  const isValid = await verifyInternalToken(existingToken);

  if (!isValid) {
    const newToken = await generateInternalToken();
    response.cookies.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
