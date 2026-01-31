import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies(); // ✅ await

    const token = cookieStore.get("accessToken")?.value;
    const userCookie = cookieStore.get("userData")?.value;

    if (!token || !userCookie) {
      return NextResponse.json(
        { error: "Token ou usuário não encontrado" },
        { status: 401 },
      );
    }

    const user = JSON.parse(decodeURIComponent(userCookie));
    const userIdFromCookie = user?.id;

    // 👇 Obtem o ID da query string (para dependentes)
    const searchParams = request.nextUrl.searchParams;
    const queryId = searchParams.get("id");

    const userId = queryId ? parseInt(queryId) : userIdFromCookie;

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não encontrado" },
        { status: 400 },
      );
    }

    const res = await fetch(`${API_BASE_URL}/autorizacao/aluno/${userId}`, {
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Erro no servidor" },
        { status: res.status },
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
