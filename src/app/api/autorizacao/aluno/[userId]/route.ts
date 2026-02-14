import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 🔹 Extrair o userId manualmente do pathname
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const userId = Number(pathParts[pathParts.indexOf("aluno") + 1]);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "userId inválido" }, { status: 400 });
    }

    // 🔹 Token do cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    // 🔹 Buscar autorizações de dependentes
    const response = await fetch(`${API_BASE_URL}/autorizacao/dependentes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const rawData: unknown = await response.json();

    if (!response.ok) {
      return NextResponse.json(rawData, { status: response.status });
    }

    // 🔹 Garantir que é array
    if (!Array.isArray(rawData)) {
      return NextResponse.json(
        { error: "Formato inválido da API" },
        { status: 500 },
      );
    }

    // 🔹 Filtrar apenas autorizações do aluno (sem any)
    const filtradas = rawData.filter((aut) => {
      if (
        typeof aut === "object" &&
        aut !== null &&
        "userIdAlAut" in aut &&
        typeof (aut as { userIdAlAut: unknown }).userIdAlAut === "number"
      ) {
        return (aut as { userIdAlAut: number }).userIdAlAut === userId;
      }
      return false;
    });

    return NextResponse.json(filtradas);
  } catch (err: unknown) {
    console.error(err);

    const message = err instanceof Error ? err.message : "Erro desconhecido";

    return NextResponse.json(
      { error: "Erro interno", details: message },
      { status: 500 },
    );
  }
}
