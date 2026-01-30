// src/app/api/user/[id]/reset-password/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

// ✅ PATCH /api/user/:id/reset-password → redefine a senha do usuário
export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    // Pega o ID da URL
    const url = new URL(request.url);
    const userId = url.pathname.split("/").slice(-2, -1)[0]; // pega o [id] da rota

    const response = await fetch(
      `${API_BASE_URL}/user/reset-password/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao redefinir senha", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Erro interno", details: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Erro interno", details: "Erro desconhecido" },
      { status: 500 },
    );
  }
}
