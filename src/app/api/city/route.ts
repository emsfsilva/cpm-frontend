import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/city`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { error: "Erro ao buscar cidades", details: data },
        { status: response.status },
      );
    }

    const cidades = await response.json();
    return NextResponse.json(cidades);
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
