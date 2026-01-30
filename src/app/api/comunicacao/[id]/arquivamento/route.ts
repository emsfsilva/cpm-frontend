// src/app/api/comunicacao/[id]/arquivamento/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    // Extrai o id da URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    // ['', 'api', 'comunicacao', '123', 'arquivamento']
    const id = pathParts[pathParts.indexOf("comunicacao") + 1];

    const { userIdArquivamento, motivoArquivamento } = await request.json();

    const token = cookies().get("accessToken")?.value;

    const response = await fetch(`${API_BASE_URL}/comunicacao/arquivar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userIdArquivamento, motivoArquivamento }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao arquivar comunicação", details: data },
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
