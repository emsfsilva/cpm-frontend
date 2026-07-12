// src/app/api/comunicacao/[id]/pdf/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

// GET /api/comunicacao/:id/pdf → busca o PDF gerado no backend e repassa ao cliente
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // .../comunicacao/[id]/pdf -> penúltimo segmento é o id
    const segments = url.pathname.split("/").filter(Boolean);
    const comunicacaoId = segments[segments.length - 2];

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/comunicacao/${comunicacaoId}/pdf`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      // O backend pode não devolver JSON em caso de erro do Puppeteer, então tratamos com segurança
      let details: unknown;
      try {
        details = await response.json();
      } catch {
        details = await response.text();
      }
      return NextResponse.json(
        { error: "Erro ao gerar PDF", details },
        { status: response.status },
      );
    }

    const pdfArrayBuffer = await response.arrayBuffer();

    const nomeArquivo = `Comunicação nº ${comunicacaoId}.pdf`;
    // Content-Disposition não aceita acentos/caracteres especiais direto no
    // "filename" clássico; usamos filename* (RFC 5987) pra UTF-8, com um
    // fallback ASCII simples em "filename" pra navegadores mais antigos.
    const nomeArquivoAscii = `Comunicacao_no_${comunicacaoId}.pdf`;

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${nomeArquivoAscii}"; filename*=UTF-8''${encodeURIComponent(nomeArquivo)}`,
      },
    });
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
