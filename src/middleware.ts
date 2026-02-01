import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (
    path.startsWith("/assets/images/") ||
    path.startsWith("/_next/static/") ||
    path === "/favicon.ico" ||
    path === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("accessToken");
  const JWT_SECRET =
    process.env.JWT_SECRET ||
    "senhaMuitoGrandeParaNaoPerderAbcdjflkjsagdflsagjk";

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
  }

  if (authToken && !publicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|_next/static|_next/image).*)"],
};
