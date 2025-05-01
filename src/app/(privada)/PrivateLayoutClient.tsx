'use client'; // Diretriz para o componente ser tratado no cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './privateLayout.module.css';
import Link from 'next/link';
import Image from 'next/image';

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
  aluno?: {
    id: number;
    userId: number;
    resp1: string;
    resp2: string;
    grauInicial : number;
    turmaId: number;
    turma: {
      id: number;
      name: string; // Nome da Turma
      cia: {
        id: number;
        name: string; // Nome da Cia
      };
    };
  };
}


const getUserFromCookies = (): User | null => {
  if (typeof window !== 'undefined') {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData='));

    if (userCookie) {
      const userString = userCookie.split('=')[1];
      try {
        const user = JSON.parse(decodeURIComponent(userString)); // Decodifica e parseia o cookie
        console.log('User from cookie:', user); // Adicionado log para diagnóstico
        return user;
      } catch (error) {
        console.error('Erro ao parsear userData do cookie', error);
        return null;
      }
    }
  }
  return null;
};

export default function PrivateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [submenuCaVisible, setSubmenuCaVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Estado para o dropdown

  // Estados para controlar a visibilidade dos submenus das Cias
  const [cia1Visible, setCia1Visible] = useState(false);
  const [cia2Visible, setCia2Visible] = useState(false);
  const [cia3Visible, setCia3Visible] = useState(false);


  const router = useRouter();

  // Efeito para buscar o usuário do cookie
  useEffect(() => {
    const userData = getUserFromCookies(); // Recupera o usuário do cookie
    if (userData) {
      setUser(userData); // Armazena o usuário no estado
    } else {
      // Redireciona para login caso o usuário não exista
      console.log('Usuário não encontrado no cookie. Redirecionando para o login...');
      router.push('/login');
    }
  }, [router]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Alterna a visibilidade do dropdown
  };

  const toggleSubmenuAluno = () => {
    setSubmenuCaVisible(!submenuCaVisible);
  };

  const toggleCia1 = (e: React.MouseEvent) => {
    e.preventDefault();
    setCia1Visible(!cia1Visible);
  };

  const toggleCia2 = (e: React.MouseEvent) => {
    e.preventDefault();
    setCia2Visible(!cia2Visible);
  };

  const toggleCia3 = (e: React.MouseEvent) => {
    e.preventDefault();
    setCia3Visible(!cia3Visible);
  };

  if (!user) {
    return <div>Você não está autenticado. Redirecionando para o login...</div>;
  }

  return (
    <div className={styles.layoutContainer}>
      {/* Conteúdo Principal */}
        <div className={styles.mainContent}>
          
          {/* Sidebar */}
              <div className={`${styles.sidebar} ${sidebarVisible ? styles.visible : ''}`}>
                <div className={styles.sidebarLogo}>
                  <Image src="/assets/images/logo.png" alt="Logo" width={150} height={150} />
                </div>
                <h1>CPM-PE</h1>
                <div className={styles.userImage}>
                  <Image src="/assets/images/avatar.png" alt="Logo" width={150} height={150} />
                </div>
                <h1>MENU</h1>
                <div className={styles.nav}>
                  <ul>
                    <li><Link href="/" className={styles.navItem}><i className={`fa fa-home ${styles.navIcon}`}></i> Index</Link></li>
                    <li><Link href="/user" className={styles.navItem}><i className={`fa fa-users ${styles.navIcon}`}></i> Usuarios</Link></li>
                    <li><Link href="/perfil" className={styles.navItem}><i className={`fa fa-user ${styles.navIcon}`}></i> Perfil</Link></li>
                    {/* Menu Aluno */}
                    <li className={styles.navItem} onClick={toggleSubmenuAluno}>
                      <i className={`fa fa-sitemap  ${styles.navIcon}`}></i> CA
                      {submenuCaVisible && (
                        <ul className={styles.submenu}>
                          <li><a href="/aluno" className={styles.submenuItem}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>Alunos</a></li>
                          <li onClick={toggleCia1}>
                            <a href="#" className={styles.submenuItem}><i className={`fa fa-sitemap  ${styles.navIcon}`}></i>1ª CIA</a>
                            {cia1Visible && (
                              <ul className={styles.submenu}>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>A1</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>A2</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>B1</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>B2</a></li>
                              </ul>
                            )}
                          </li>
                          <li onClick={toggleCia2}>
                            <a href="#" className={styles.submenuItem}><i className={`fa fa-sitemap  ${styles.navIcon}`}></i>2ª CIA</a>
                            {cia2Visible && (
                              <ul className={styles.submenu}>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>C1</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>C2</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>D1</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>D2</a></li>
                              </ul>
                            )}
                          </li>
                          <li onClick={toggleCia3}>
                            <a href="#" className={styles.submenuItem}><i className={`fa fa-sitemap  ${styles.navIcon}`}></i>3ª CIA</a>
                            {cia3Visible && (
                              <ul className={styles.submenu}>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>E1</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>E2</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>F1</a></li>
                                <li><a href="#" className={styles.submenuItemTurma}><i className={`fa fa-mortar-board  ${styles.navIcon}`}></i>F2</a></li>
                              </ul>
                            )}
                          </li>
                          <li><a href="/perfil" className={styles.submenuItem}><i className={`fa fa-check-square ${styles.navIcon}`}></i> Escalas</a></li>
                          <li><a href="/perfil" className={styles.submenuItem}><i className={`fa fa-address-card ${styles.navIcon}`}></i> Autorização</a></li>
                          <li><a href="/comunicacaolistar" className={styles.submenuItem}><i className={`fa fa-comments ${styles.navIcon}`}></i> Comunicação</a></li>
                          <li><a href="/perfil" className={styles.submenuItem}><i className={`fa fa-folder ${styles.navIcon}`}></i> Publicação</a></li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.userInfo}>
                  <div className={styles.navLogoHeader}>
                    <Image src="/assets/images/logo.png" alt="Logo" width={30} height={30} />
                    <span>Atos_A</span>
                  </div>
              
                  <span onClick={toggleDropdown} className={styles.userName}>  
                    {user.pg} {user.nomeGuerra} | {user.funcao} <i className={`fa fa-ellipsis-v ${styles.navIconHeader}`}></i>
                  </span>
                  {/* Dropdown */}
                  {dropdownVisible && (
                    <div className={styles.dropdown}>
                      <ul>
                        <li><Link href="/perfil"><i className={`fa fa-key ${styles.navIcon}`}></i>Senha</Link></li>
                        <li><Link href="/sair"><i className={`fa fa-sign-out ${styles.navIcon}`}></i>Sair</Link></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
          
            {children}
          
        </div>

      {/* Footer com ícones de acordo com o tipo de usuário */}
        <div className={styles.sidebarIconOnly}>
          {/* Se for Aluno */}
          {user.typeUser === 1 && (
            <>
              <Link href="/" className={styles.navItem}>
                <i className={`fa fa-home ${styles.navIcon}`}></i><br /> Home
              </Link>
              <Link href="/perfil" className={styles.navItem}>
                <i className={`fa fa-mortar-board ${styles.navIcon}`}></i><br /> Meus dados
              </Link>
              <Link href="/autorização" className={styles.navItem}>
                <i className={`fa fa-vcard ${styles.navIcon}`}></i><br /> Autorização
              </Link>
              <Link href={`/comunicacaoalunolistar/${user.id}`} className={styles.navItem}>
                <i className={`fa fa-book ${styles.navIcon}`}></i><br /> Comunicações
              </Link>
            </>
          )}

          {/* Se NAO for Aluno */}
          {user.typeUser !== 1 && (
            <>
              <Link href="/" className={styles.navItem}>
                <i className={`fa fa-home ${styles.navIcon}`}></i><br /> Home
              </Link>
              <Link href="/perfil" className={styles.navItem}>
                <i className={`fa fa-mortar-board ${styles.navIcon}`}></i><br /> Meus dados
              </Link>
              <Link href="/aluno" className={styles.navItem}>
                <i className={`fa fa-vcard ${styles.navIcon}`}></i><br /> Alunos
              </Link>
            </>
          )}
        </div>
    </div>
  );
}
