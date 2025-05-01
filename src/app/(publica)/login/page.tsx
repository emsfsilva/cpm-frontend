'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css'; // Importando os estilos do módulo CSS
import Image from 'next/image'; // Importando o componente Image

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Enviando requisição de login...');

    const response = await fetch('http://localhost:8081/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await response.text();
    console.log('Resposta bruta do servidor:', responseText);

    try {
      const data = JSON.parse(responseText);

      console.log('Resposta JSON da API:', data);

      if (response.ok && data.accessToken) {
        // Salva o token no cookie
        document.cookie = `accessToken=${data.accessToken}; path=/`;

        // Redireciona para o dashboard
        console.log('Login bem-sucedido, redirecionando...');
        router.push('/');
      } else {
        setErrorMessage('Email ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao processar a resposta JSON:', error);
      setErrorMessage('Erro na requisição');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/assets/images/logo.png" // Caminho da imagem
          alt="Logo"
          width={200} // Largura da imagem (ajuste conforme necessário)
          height={200} // Altura da imagem (ajuste conforme necessário)
          className={styles.logo}
        />
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit" className={styles.button}>Entrar</button>
      </form>
    </div>
  );
}
