// src/app/api/comentario/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

/* =========================
   POST /api/comentario
========================= */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies(); // ✅ COM await (sua versão)
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/comentario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao cadastrar comentário", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
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

/* =========================
   GET /api/comentario
========================= */
export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ COM await
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/comentario`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar comentário", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
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
