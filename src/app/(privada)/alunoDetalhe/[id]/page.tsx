'use client';

import styles from '../../privateLayout.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams para pegar os parâmetros de URL no App Router
import Image from 'next/image';
import Link from 'next/link';


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
}

interface AlunoDetalhe {
  id: number;
  userId: number;
  resp1: string;
  resp2: string;
  turmaId: number;
  turma: {
    id: number;
    name: string; // Nome da Turma
    cia: {
      id: number;
      name: string; // Nome da Cia
    };
  };

  user?: {
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
}

const AlunoDetalhePage = () => {

    const [userLogin, setUserLogin] = useState<UserLogin | null>(null); // Inicialmente null

    const [aluno, setAluno] = useState<AlunoDetalhe | null>(null);
    const { id } = useParams(); // Use useParams para acessar o id da URL, ao invés de router.query


  useEffect(() => {
    if (id) {


            // bloco para passar na URL o usuario logado
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
                
              } catch (error) {
                console.error('Erro ao parsear os dados do usuário do cookie:', error);
              }
            } else {
              console.log('Cookie "userData" não encontrado.');
            }



      console.log('ID da URL:', id); // Verifique o valor de id
      fetch(`http://localhost:8081/aluno/${id}`)
        .then((response) => response.json())
        .then((data) => setAluno(data))
        .catch((error) => {
          console.error('Erro ao carregar os detalhes do aluno:', error);
        });
    }
  }, [id]);

  if (!aluno) return <div>Carregando...</div>;

  

return (
  <div className={styles.conteudoPagina}>
    <div className={styles.divUserImagePerfil}>
      <Image src="/assets/images/avatar.png" alt="Logo" width={80} height={80} />
      <div className={styles.userInfoPerfil}>
        <span className={styles.userNamePerfil}>
          {aluno.user?.pg} {aluno.user?.nomeGuerra}
        </span>
      </div>
      <div>
        <span className={styles.userFuncaoPerfil}>
         Turma: {aluno.turma.name} | {aluno.turma?.cia?.name}
        </span>
      </div>
    </div>

    
      <div className={styles.profileDetails}>
        <ul>
          <li>
            <i className={`fa fa-user ${styles.navIcon}`}></i> {aluno.user?.name}
            <i className={`fa fa-check ${styles.rightIcon}`}></i>
          </li>
          <li>
            <i className={`fa fa-at ${styles.navIcon}`}></i> {aluno.user?.email}
            <i className={`fa fa-check ${styles.rightIcon}`}></i>
          </li>
          <li>
            <i className={`fa fa-phone ${styles.navIcon}`}></i> {aluno.user?.phone}
            <i className={`fa fa-check ${styles.rightIcon}`}></i>
          </li>
          <li>
            <i className={`fa fa-barcode ${styles.navIcon}`}></i> Matricula: 
            <i className={`${styles.rightIcon}`}></i>
            {aluno.user?.mat}
          </li>
          <li>
            <i className={`fa fa-barcode ${styles.navIcon}`}></i> Cpf: 
            <i className={`${styles.rightIcon}`}></i>
            <i className={`fa fa-lock ${styles.rightIcon}`}></i>
          </li>
          <li>
            <i className={`fa fa-line-chart ${styles.navIcon}`}></i> Comportamento: 
            <i className={`${styles.rightIcon}`}></i>
            <i className={`fa fa-lock ${styles.rightIcon}`}></i>
          </li>
          <li>
            <i className={`fa fa-cube ${styles.navIcon}`}></i> Turma: 
            <i className={`${styles.rightIcon}`}></i>
            {aluno.turma?.name || 'Turma não informada'}
          </li>
          <li>
            <i className={`fa fa-sitemap ${styles.navIcon}`}></i> Cia: 
            <i className={`${styles.rightIcon}`}></i>
            {aluno.turma?.cia?.name || 'Cia não informada'}
          </li>
          <li>
              <i className={`fa fa-user ${styles.navIcon}`}></i> Pai: 
              <i className={`${styles.rightIcon}`}></i>
              {aluno?.resp1 || 'Resposnsavel não informado'}
            </li>
            <li>
              <i className={`fa fa-user ${styles.navIcon}`}></i> Mae: 
              <i className={`${styles.rightIcon}`}></i>
              {aluno?.resp2 || 'Resposnsavel não informado'}
            </li>
            <li>
            <Link href={`/comunicacaocad?userIdCom=${userLogin.id}&userId=${aluno.userId}`}>
              <i className={`fa fa-comments ${styles.navIcon}`}></i> Comunicação
            </Link>
            <i className={`fa fa-angle-right ${styles.rightIcon}`}></i>
          </li>
          <li>
            <i className={`fa fa-vcard ${styles.navIcon}`}></i> Autorização
            <i className={`fa fa-angle-right ${styles.rightIcon}`}></i>
          </li>
        </ul>
      </div>
  </div>
);

};


export default AlunoDetalhePage;

