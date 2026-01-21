import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/turma`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar turmas", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro interno ao buscar turmas", details: error.message },
      { status: 500 }
    );
  }
}
