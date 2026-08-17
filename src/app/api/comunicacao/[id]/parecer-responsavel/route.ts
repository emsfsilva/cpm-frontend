// src/app/api/comunicacao/[id]/parecer-responsavel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export async function PUT(request: NextRequest) {
  try {
    // Extrai id da URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    // ['', 'api', 'comunicacao', '123', 'parecer-responsavel']
    const id = pathParts[pathParts.indexOf("comunicacao") + 1];

    // Pega os dados do body
    const { parecerResponsavel } = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/comunicacao/parecer-responsavel/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parecerResponsavel }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao enviar parecer do responsável", details: data },
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
