import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Libera rotas da API
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Libera arquivos estáticos
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

  // Não autenticado tentando rota pública
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Não autenticado tentando rota privada
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Autenticado → segue o jogo
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|_next/static|_next/image).*)"],
};
