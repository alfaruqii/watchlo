import { NextRequest, NextResponse } from "next/server";
import {
  validateApiAccess,
  generateInternalToken,
  verifyInternalToken,
  COOKIE_NAME,
} from "./app/lib/security";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
