// src/app/api/aluno/[id]/responsaveis/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // extrai o id da URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    // ['', 'api', 'aluno', '123', 'responsaveis']
    const alunoId = pathParts[pathParts.indexOf("aluno") + 1];

    const body = await req.json();

    // extrai token do cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 },
      );
    }

    // chama a API externa
    const res = await fetch(
      `http://localhost:8081/aluno/${alunoId}/responsaveis`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Erro ao atualizar responsáveis:", err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
