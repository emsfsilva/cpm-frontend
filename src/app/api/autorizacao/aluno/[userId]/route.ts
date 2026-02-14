import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 🔹 Extrair o userId manualmente do pathname
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/"); // ['', 'api', 'autorizacao', 'aluno', '2']
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 🔹 Filtra apenas as autorizações do aluno
    const filtradas = data.filter((aut: any) => aut.userIdAlAut === userId);

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
