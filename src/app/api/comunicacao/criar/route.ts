// src/app/api/comunicacao/criar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

// POST /api/comunicacao/criar?userIdCom=X
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Token não encontrado" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const userIdCom = req.nextUrl.searchParams.get("userIdCom");

  const response = await fetch(
    `${API_BASE_URL}/comunicacao/criar?userIdCom=${userIdCom}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || "Erro ao criar comunicação" },
      { status: response.status },
    );
  }

  return NextResponse.json(data);
}
