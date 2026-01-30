// src/app/api/autorizacao/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Extrai o id da URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    // ['', 'api', 'autorizacao', '123']
    const id = pathParts[pathParts.indexOf("autorizacao") + 1];

    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/autorizacao/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar autorização", details: data },
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
