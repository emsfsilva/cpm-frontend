// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

// ✅ GET /api/user/:id → busca detalhes do comunicacao
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const comunicacaoId = url.pathname.split("/").pop(); // pega o ID do final da URL

    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/comunicacao/${comunicacaoId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar comunicacao", details: data },
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

// ✅ PATCH /api/user/:id → edita comunicacao
export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const comunicacaoId = url.pathname.split("/").pop(); // ID do usuário na URL
    const body = await request.json();

    console.log("Editando comunicacao ID:", comunicacaoId);
    console.log("Dados recebidos:", body);

    const response = await fetch(
      `${API_BASE_URL}/comunicacao/${comunicacaoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro ao atualizar no backend:", data);
      return NextResponse.json(
        { error: "Erro ao editar", details: data },
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

// ✅ DELETE /api/user/:id → exclui usuário
export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const comunicacaoId = url.pathname.split("/").pop(); // pega o ID da URL

    const response = await fetch(
      `${API_BASE_URL}/comunicacao/${comunicacaoId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: "Erro ao excluir", details: error },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
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
