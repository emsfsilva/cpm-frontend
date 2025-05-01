'use client';

import { useEffect, useState } from 'react';
import styles from '../privateLayout.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserLogin {
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
  addresses?: {
    complement: string;
    numberAddress: number;
    cep: string;
    city?: {
      name: string;
      state?:{
        name:string;
      };
    };
  };
  aluno?: {
    id: number;
    userId: number;
    resp1: string;
    resp2: string;
    grauInicial : number;
    grauAtual : number;
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

export default function Perfil() {
  const [userLogin, setUserLogin] = useState<UserLogin | null>(null); // Inicialmente null
  const [userDetails, setUserDetails] = useState<any | null>(null); // Estado para armazenar as relações do usuário
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const router = useRouter();

  useEffect(() => {
    // Lê o cookie 'userData' que foi configurado no middleware
    const userLoginData = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData='))?.split('=')[1];

    if (userLoginData) {
      // Decodifica e converte de volta para o formato de objeto
      const decodedUserLoginData = decodeURIComponent(userLoginData);
      try {
        const parsedUserLogin = JSON.parse(decodedUserLoginData); // Tenta fazer o parse do JSON
        setUserLogin(parsedUserLogin); // Atualiza o estado do usuário
        console.log('Usuário carregado do cookie:', parsedUserLogin); // Verifica se o usuário foi carregado corretamente
        
        // Após carregar o usuário, faz a consulta das relações
        fetchUserDetails(parsedUserLogin.id);
      } catch (error) {
        console.error('Erro ao parsear os dados do usuário do cookie:', error);
      }
    } else {
      console.log('Cookie "userData" não encontrado.');
    }

    // Setar o estado de loading como falso após a leitura
    setIsLoading(false);
  }, []); // O useEffect será chamado apenas uma vez, após a montagem do componente

  // Função para buscar as relações do usuário
  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/user/${userId}`);
      const data = await response.json();
      setUserDetails(data); // Armazena as relações do usuário
    } catch (error) {
      console.error('Erro ao buscar as relações do usuário:', error);
    }
  };

  // Se os dados do usuário ainda não estiverem carregados, exibe um loading
  if (isLoading || !userDetails) {
    return <div>Carregando...</div>; // Aqui você pode exibir um loading enquanto espera os dados
  }

  // Se não tiver usuário, você pode redirecionar ou mostrar algo
  if (!userLogin) {
    return <div>Você não está autenticado. Redirecionando para o login...</div>;
  }

  const handleView = (userId: number) => {
    console.log(`Redirecionando para lista das Comunicações do Aluno com id: ${userId}`);
    router.push(`/comunicacaoalunolistar/${userId}`);
  };

  console.log("Os dados do userDetails é", userDetails);

  

  return (
    <div className={styles.conteudoPagina}>
      <div className={styles.divUserImagePerfil}>
        <Image src="/assets/images/avatar.png" alt="Logo" width={80} height={80} />
        <div className={styles.userInfoPerfil}>
          <span className={styles.userNamePerfil}>
            {userLogin.pg} {userLogin.nomeGuerra} {userLogin.orgao}
          </span>
        </div>
        <div>
          <span className={styles.userFuncaoPerfil}>
            Usuario: {userLogin.funcao}
          </span>
        </div>
      </div>

      {/* INICIO PERFIL ALUNO*/}
        {userLogin.typeUser === 1 && (
          <div className={styles.profileDetails}>
            <ul>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i> {userLogin.name}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-at ${styles.navIcon}`}></i> {userLogin.email}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-phone ${styles.navIcon}`}></i> {userLogin.phone}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-barcode ${styles.navIcon}`}></i> Matricula: 
                <i className={`${styles.rightIcon}`}></i>
                {userLogin.mat}
              </li>
              <li>
                <i className={`fa fa-barcode ${styles.navIcon}`}></i> Cpf: 
                <i className={`${styles.rightIcon}`}></i>
                {userLogin.cpf}
              </li>
              <li>
                <i className={`fa fa-line-chart ${styles.navIcon}`}></i> Comportamento: 
                <i className={`${styles.rightIcon}`}></i>
                {userDetails.aluno?.grauAtual}
              </li>
              <li>
                <i className={`fa fa-cube ${styles.navIcon}`}></i> Turma: 
                <i className={`${styles.rightIcon}`}></i>
                {userDetails.aluno?.turma?.name || 'Turma não informada'}
              </li>
              <li>
                <i className={`fa fa-sitemap ${styles.navIcon}`}></i> Cia: 
                <i className={`${styles.rightIcon}`}></i>
                {userDetails.aluno?.turma?.cia?.name || 'Cia não informada'}
              </li>
              <li>
                <i className={`fa fa-book ${styles.navIcon}`}></i> Comunicação
                <i onClick={() => handleView(userDetails.aluno?.userId)} className={`fa fa-angle-right ${styles.rightIcon}` }></i>
              </li>
              <li>
                <i className={`fa fa-vcard ${styles.navIcon}`}></i> Autorização
                <i className={`fa fa-angle-right ${styles.rightIcon} `}></i>
              </li><br></br>
              <h1>Responsavel(s)</h1>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i> Pai: 
                {userDetails.aluno?.resp1 || 'Resposnsavel não informado'} <br></br>
                <i className={`${styles.rightIcon}`}></i>
                {userLogin.phone || 'Resposnsavel não informado'}
              </li>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i> Mae: 
                {userDetails.aluno?.resp2 || 'Resposnsavel não informado'} <br></br>
                <i className={`${styles.rightIcon}`}></i>
                {userLogin.phone || 'Resposnsavel não informado'}
              </li>
            </ul>
          </div>
        )}

      {/* FIM PERFIL ALUNO*/}

      {/* INICIO PERFIL MASTER*/}
        {userLogin.typeUser === 10 && (
          <div className={styles.profileDetails}>
            <ul>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i> {userLogin.name}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-at ${styles.navIcon}`}></i> {userLogin.email}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-phone ${styles.navIcon}`}></i> {userLogin.phone}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-barcode ${styles.navIcon}`}></i> {userLogin.cpf}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-barcode ${styles.navIcon}`}></i> {userLogin.mat}
                <i className={`fa fa-check ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-comments ${styles.navIcon}`}></i> Comunicação
                <i className={`fa fa-angle-right ${styles.rightIcon}`}></i>
              </li>
              <li>
                <i className={`fa fa-book ${styles.navIcon}`}></i> Minha Escala
                <i className={`fa fa-angle-right ${styles.rightIcon}`}></i>
              </li>
            </ul>
          </div>
        )}

      {/* FIM PERFIL MASTER*/}


        <div className={styles.profileDetails}>
          <h1>Endereço(s)</h1>
          <ul>
            {userDetails.addresses && userDetails.addresses.length > 0 ? (
              userDetails.addresses.map((address: any, index: number) => (
                <li key={index}>
                  <i className={`fa fa-home ${styles.navIcon}`}></i> 
                  {address.complement || 'Endereço não informado'}, 
                  nº {address.numberAddress || 'Número não informado'}, {address.city?.name || 'Cidade'} - {address.city?.state?.name || 'Estado'}
                </li>
              ))
            ) : (
              <li>Endereço não informado</li>
            )}
          </ul>
        </div>


      <div className={styles.lastLogin}>
        <h3>Último Acesso</h3>
        <p><i className={`fa fa-clock ${styles.navIcon}`}></i>{new Date(userLogin.iat * 1000).toLocaleString()}</p>
      </div>
    </div>
  );
}
