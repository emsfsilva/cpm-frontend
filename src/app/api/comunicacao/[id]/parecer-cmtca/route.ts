// src/app/api/comunicacao/[id]/parecer-cmtca/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export async function PUT(request: NextRequest) {
  try {
    // Extrai id da URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    // ['', 'api', 'comunicacao', '123', 'parecer-cmtca']
    const id = pathParts[pathParts.indexOf("comunicacao") + 1];

    // Pega os dados do body
    const { parecerCa, userIdCa } = await request.json();

    // Pega o token do cookie
    const token = cookies().get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/comunicacao/parecerca/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parecerCa, userIdCa }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao enviar parecer do CA", details: data },
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
