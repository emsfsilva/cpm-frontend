'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Limpar os cookies
    document.cookie = 'accessToken=; Max-Age=0; path=/';
    document.cookie = 'userData=; Max-Age=0; path=/';

    // Redirecionar após limpar
    router.push('/login');
  }, [router]);

  return <p>Saindo...</p>;
}
