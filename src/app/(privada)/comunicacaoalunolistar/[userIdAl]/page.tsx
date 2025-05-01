'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../privateLayout.module.css';
import Image from 'next/image';

interface Comunicacao {
  id: number;
  userIdCom: number;
  motivo: string;
  grauMotivo: number;
  descricaoMotivo: string;
  natureza: string | null;
  dataCom: string;
  userIdAl: number;
  resposta: string | null;
  dataResp: string | null;
  userIdCmtCia: number | null;
  opiniaoFinal: string | null;
  dataOpFinal: string | null;
  status: string;
  dtAtualizacaoStatus: string | null;
  useral?: {
    id: number;
    pg: string;
    nomeGuerra: string;
  };
  usercom?: {
    id: number;
    pg: string;
    funcao: string;
    nomeGuerra: string;
  };
  usercmtcia?: {
    id: number;
    pg: string;
    nomeGuerra: string;
  };
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const ComunicacaosPage = () => {
  const [comunicacaos, setComunicacaos] = useState<Comunicacao[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const router = useRouter();
  const params = useParams();
  const userIdAl = params.userIdAl;

  useEffect(() => {
    const fetchComunicacaos = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))?.split('=')[1];

        if (!token || !userIdAl) return;

        const response = await fetch(`http://localhost:8081/comunicacao/aluno/${userIdAl}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar comunicações: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Garante que é um array
        if (Array.isArray(data)) {
          setComunicacaos(data);
        } else {
          setComunicacaos([]);
        }
        

      } catch (error) {
        console.error(error);
        setError((error as Error).message);
      }
    };

    fetchComunicacaos();
  }, [userIdAl]);

  const handleView = (id: number) => {
    router.push(`/comunicacaoresp/${id}`);
  };

  const comunicacoesFiltradas = comunicacaos.filter((comunicacao) => {
    const textoBusca = filtro.toLowerCase();
    return (
      comunicacao.usercom?.nomeGuerra?.toLowerCase().includes(textoBusca) ||
      comunicacao.useral?.nomeGuerra?.toLowerCase().includes(textoBusca) ||
      comunicacao.status?.toLowerCase().includes(textoBusca)
    );
  });

  return (
    <div className={styles.conteudoPagina}>
      <h1 className={styles.tituloListar}>Comunicações</h1>

      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      <input className={styles.inputBuscar}
        type="text"
        placeholder="Buscar..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {comunicacoesFiltradas.length > 0 ? (
        comunicacoesFiltradas.map(comunicacao => (
          <div className={styles.comunicacaoAlunoList} key={comunicacao.id}>
            <ul>
            <li>
              <div className={styles.comunicacaoAlunoListImg}>
                <Image src="/assets/images/logo.png" alt="Logo" width={50} height={50} />
              </div>
              <div>
                <div style={{ fontSize: '9px' }}><strong>{comunicacao.motivo} em {comunicacao.dataCom ? new Date(comunicacao.dataCom).toLocaleString() : 'Nenhuma data informada'}</strong> | <span style={{ color: '#ff0101' }}>Grau: {comunicacao.grauMotivo} ({comunicacao.natureza})</span></div>
                <div style={{ color: '#1010d4' }}>{comunicacao.usercom?.pg} {comunicacao.usercom?.nomeGuerra} {comunicacao.usercom?.funcao}</div>
                <div style={{ color: '#000000' }}>Status da Comunicação: {comunicacao.status}</div>
                <div style={{ color: '#aeacab' }}>Ultima Atualização :  {comunicacao.dtAtualizacaoStatus ? new Date(comunicacao.dtAtualizacaoStatus).toLocaleString() : 'Nenhuma data informada'}</div>
              </div>
              <div>
                <i className={`${styles.rightIcon}`}></i>
              </div>
                {/* Condição para exibir o icon */}
                  {comunicacao.status === "Comunicação publicada" && (
                    <i style={{ color: '#4fb91b' }} className={`fa fa-lock ${styles.rightIcon}`}></i>
                  )}
                {/* Condição para exibir o icon */}
                <i onClick={() => handleView(comunicacao.id)} className={`fa fa-angle-right ${styles.rightIcon}`}></i>
            </li>
              
            </ul>
          </div>
        ))
      ) : (
        !error ? (
          <p>Parabéns! Não existe Comunicação para Você</p>
        ) : (
          <p style={{ color: 'red' }}>Erro ao buscar comunicações</p>
        )
      )}
    </div>
  );
};

export default ComunicacaosPage;
