// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout realizado com sucesso",
  });

  // Remove os cookies de autenticação
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("userData", "", {
    httpOnly: false,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
