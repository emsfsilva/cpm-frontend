import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

// 🔹 Tipagem do que vem da API externa
interface AutorizacaoAPI {
  userIdAlAut: number;
  [key: string]: unknown; // permite outras propriedades sem usar any
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const userId = Number(pathParts[pathParts.indexOf("aluno") + 1]);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "userId inválido" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/autorizacao/dependentes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data: AutorizacaoAPI[] = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const filtradas = data.filter((aut) => aut.userIdAlAut === userId);

    return NextResponse.json(filtradas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
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
