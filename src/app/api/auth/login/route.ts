// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const seduc = String(body.seduc || "").trim();
    const password = String(body.password || "").trim();

    if (!seduc || !password) {
      return NextResponse.json(
        { error: "Login e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // 🔗 Chamada para API externa
    const externalApiResponse = await fetch(`${API_BASE_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seduc, password }),
    });

    const data = await externalApiResponse.json();

    if (!externalApiResponse.ok) {
      return NextResponse.json(
        { error: data?.message || "Erro ao autenticar" },
        { status: externalApiResponse.status },
      );
    }

    // ✅ Cria resposta
    const response = NextResponse.json(
      { message: "Autenticado com sucesso" },
      { status: 200 },
    );

    // 🔐 Cookie do token (somente servidor)
    response.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: false, // ⚠️ em produção com HTTPS: true
      sameSite: "lax",
      path: "/",
    });

    // 👤 Cookie do usuário (visível no client)
    response.cookies.set("userData", JSON.stringify(data.user), {
      httpOnly: false,
      secure: false, // ⚠️ em produção com HTTPS: true
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);

    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
