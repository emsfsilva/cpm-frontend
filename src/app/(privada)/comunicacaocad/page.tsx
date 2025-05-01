'use client';

import { useEffect, useState } from 'react';
import styles from '../privateLayout.module.css';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface Aluno {
  id: number;
  userId: number;
  resp1: string;
  resp2: string;
  turmaId: number;
  turma: {
    id: number;
    name: string;
    cia: {
      id: number;
      name: string;
    };
  };
  user: {
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
  };
}

export default function CadastrarComunicacao() {
  const [userLogin, setUserLogin] = useState<UserLogin | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [descricaoMotivo, setdescricaoMotivo] = useState('');
  const [motivoSelecionada, setMotivoSelecionada] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const userIdCom = searchParams.get('userIdCom');
  const userIdAl = searchParams.get('userId');
  const router = useRouter();

  useEffect(() => {
    const userLoginData = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData='))?.split('=')[1];

    if (userLoginData) {
      const decodedUserLoginData = decodeURIComponent(userLoginData);
      try {
        const parsedUserLogin = JSON.parse(decodedUserLoginData);
        setUserLogin(parsedUserLogin);
        fetchUserDetails(parsedUserLogin.id);
      } catch (error) {
        console.error('Erro ao parsear os dados do usuário do cookie:', error);
      }
    }


    if (userIdAl) {
      fetchAlunoDetails(userIdAl);
    }

    console.log('O userIdAl é:', userIdAl);

    setIsLoading(false);
  }, [userIdAl]);

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/user/${userId}`);
      const data = await response.json();
      setUserLogin(data);
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    }
  };

  const fetchAlunoDetails = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8081/aluno/por-user/${userId}`);
      const data = await response.json();
      setAluno(data);
      console.log('Aluno carregado:', data);
    } catch (error) {
      console.error('Erro ao buscar os dados do aluno:', error);
    }
  };

  const CadastrarComunicacao = async () => {
    if (!descricaoMotivo || !userIdCom || !userIdAl || !motivoSelecionada) {
  alert('Todos os campos precisam ser preenchidos!');
  return;
}


    const comunicacao = {
      userIdCom: parseInt(userIdCom),
      userIdAl: parseInt(userIdAl),
      descricaoMotivo: descricaoMotivo,
      motivo: motivoSelecionada, // <- novo campo!
    };
    

    try {
      const response = await fetch(`http://localhost:8081/comunicacao/criar?userIdCom=${userIdCom}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comunicacao),
      });

      if (response.ok) {
        alert('Comunicação cadastrada com sucesso!');
        router.push('/aluno');
      } else {
        alert('Erro ao cadastrar a comunicação no front.');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao enviar os dados.');
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  if (!userLogin || !aluno) return <div>Erro ao carregar os dados.</div>;

  return (
    <div className={styles.conteudoPagina}>
      <div className={styles.tituloComunicacao}>
        <h1>Aluno | Turma: {aluno.turma.name} - {aluno.turma.cia.name}</h1>
        <h1>Comunicação</h1>
      </div>

      <div className={styles.divUserImagePerfil}>
        <Image src="/assets/images/avatar.png" alt="Logo" width={80} height={80} />
        <div className={styles.userInfoPerfil}>
          <span className={styles.userNamePerfil}>
            {aluno.user.pg} {aluno.user.nomeGuerra} {aluno.user.orgao}
          </span>
        </div>
        <div>
          <span className={styles.userFuncaoComunicacao}>
            {aluno.resp1} - {aluno.user.phone}
          </span>
          <br />
          <span className={styles.userFuncaoComunicacao}>
            {aluno.resp2} - {aluno.user.phone}
          </span>
        </div>
      </div>

      <div>
        <h1>Alteração:</h1>
        <div className={styles.comunicacaoDetails}>
          <ul>
            {["Cabelo fora do Padrão", "Chegou Atrasado", "Uniforme Alterado"].map((opcao, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  className={styles.inputComunicacaoDetails}
                  checked={motivoSelecionada === opcao}
                  onChange={() => setMotivoSelecionada(motivoSelecionada === opcao ? '' : opcao)}
                />
                {opcao}
              </li>
            ))}
          </ul>


          <h1>Descrição detalhada do fato:</h1>
          <textarea
            id="descricaoMotivo"
            className={styles.inputComunicacaoTextarea}
            value={descricaoMotivo}
            onChange={(e) => setdescricaoMotivo(e.target.value)}
          />

          <button
            className={styles.comunicacaoSalvarButton}
            onClick={CadastrarComunicacao}
          >
            Enviar
          </button>
          <button className={styles.comunicacaoCancelarButton}>Cancelar</button>
        </div>
      </div>

      <div className={styles.userFuncaoComunicacao}>
        <h3>Atenção: Conferir todos os dados antes de enviar</h3>
      </div>
    </div>
  );
}
