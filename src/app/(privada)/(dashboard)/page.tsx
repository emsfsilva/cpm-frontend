'use client';

import { useEffect, useState } from 'react';
import styles from '../privateLayout.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  orgao: string;
  pg: string;
  mat: number;
  nomeGuerra: string;
  funcao: string;
  typeUser: number;
  iat: number;
  exp: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null); // Inicialmente null
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Lê o cookie 'userData' que foi configurado no middleware
    const userData = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData='))
      ?.split('=')[1];

    if (userData) {
      // Decodifica e converte de volta para o formato de objeto
      const decodedUserData = decodeURIComponent(userData);
      try {
        const parsedUser = JSON.parse(decodedUserData); // Tenta fazer o parse do JSON
        setUser(parsedUser); // Atualiza o estado do usuário
        console.log('Usuário carregado do cookie:', parsedUser); // Verifica se o usuário foi carregado corretamente
      } catch (error) {
        console.error('Erro ao parsear os dados do usuário do cookie:', error);
      }
    } else {
      console.log('Cookie "userData" não encontrado.');
    }

    // Setar o estado de loading como falso após a leitura
    setIsLoading(false);
  }, []); // O useEffect será chamado apenas uma vez, após a montagem do componente

  // Se os dados do usuário ainda não estiverem carregados, exibe um loading
  if (isLoading) {
    return <div>Carregando...</div>; // Aqui você pode exibir um loading enquanto espera os dados
  }

  // Se não tiver usuário, você pode redirecionar ou mostrar algo
  if (!user) {
    return <div>Você não está autenticado. Redirecionando para o login...</div>;
  }

  return (
    <div className={styles.conteudoPagina} user={user}>
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user.nomeGuerra} ({user.funcao})!</p>
    </div>
  );
}
