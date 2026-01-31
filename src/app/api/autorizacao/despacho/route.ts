// src/app/api/autorizacao/despacho/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const response = await fetch(
      `${API_BASE_URL}/autorizacao/${body.id}/despacho`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          userIdDespaAut: body.userIdDespaAut,
          despacho: body.despacho,
          motivoAut: body.motivoAut,
          horaInicio: body.horaInicio,
          statusAut: body.statusAut,
          obsAut: body.obsAut || "",
          seg: body.seg,
          ter: body.ter,
          qua: body.qua,
          qui: body.qui,
          sex: body.sex,
          sab: body.sab,
          dom: body.dom,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao despachar autorização", details: data },
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
