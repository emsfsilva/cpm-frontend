import { parse } from 'cookie'; // Para fazer parse dos cookies
import { headers } from 'next/headers'; // Para pegar os headers da requisição
import { redirect } from 'next/navigation'; // Para redirecionar
import { ReactNode } from 'react';
import PrivateLayoutClient from './PrivateLayoutClient';

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const headersInstance = await headers();
  const cookieHeader = headersInstance.get('cookie');
  const cookies = parse(cookieHeader || '');
  
  // Lê o cookie 'user' e faz o parse caso exista
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  // Caso o usuário esteja autenticado (cookie presente), redireciona para o dashboard
  if (userCookie) {
    redirect('/dashboard');
  }

  // Passando o userCookie para o layout, caso não exista, o componente deve lidar com isso
  return (
    <PrivateLayoutClient user={userCookie}>
      {children}
    </PrivateLayoutClient>
  );
}
