// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  console.log('Autenticando usuário:', email);

  // Certifique-se de que o backend está na URL correta
  const backendResponse = await fetch('http://localhost:8081/api/auth', { // Corrigido para '/api/auth'
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (backendResponse.ok) {
    const data = await backendResponse.json();
    const token = data.accessToken;
    console.log('Token gerado:', token);
    return NextResponse.json({ accessToken: token });
  } else {
    const error = await backendResponse.json();
    console.log('Erro da API backend:', error);
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }
}
