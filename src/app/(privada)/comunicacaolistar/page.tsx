'use client';  // Diretriz para garantir que este arquivo seja tratado como Componente de Cliente

import { useEffect, useState } from 'react';
import styles from '../privateLayout.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Comunicacao {
  id: number;
  userIdCom: number;
  motivo: string;
  grauMotivo: number | null;
  descricaoMotivo: string;
  natureza: string;
  enquadramento: string | null;
  dataCom: string;

  userIdAl: number;
  resposta: string | null;
  dataResp: string | null;

  userIdCmtCia: number | null;
  parecerCmtCia: string | null;
  dataParecerCmtCia: string | null;

  userIdCa: number | null;
  parecerCa: string | null;
  dataParecerCa: string | null;

  userIdSubcom: number | null;
  parecerSubcom: string | null;
  dataParecerSubcom: string | null;

  status: string;
  dtAtualizacaoStatus: string | null;

  useral?: {
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
    aluno?: {
      turma: {
        name: string;
        cia: {
          name: string;
        };
      };
    };
  }
  usercom?: {
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
  }
  usercmtcia?: {
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
  }
  userca?: {
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
  }
  usersubcom?: {
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
  }
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const ComunicacaosPage = () => {
  const [comunicacaos, setComunicacaos] = useState<Comunicacao[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Inicializando o useRouter
  const [filtro, setFiltro] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grauMotivo, setgrauMotivo] = useState('');
  const [enquadramento, setenquadramento] = useState('');
  const [selectedComunicacaoId, setSelectedComunicacaoId] = useState<number | null>(null);

  const [qtdConcluidas, setConcluidas] = useState<number>(0);
  const [qtdPublicadas, setPublicadas] = useState<number>(0);
  const [qtdAguardandoPublicacao, setAguardandoPublicacao] = useState<number>(0);
  const [emTramitacao, setEmTramitacao] = useState<number>(0);
  const [statusPorCia, setStatusPorCia] = useState<Record<string, Record<string, number>>>({});
  const [qtdPorCia, setPorCia] = useState<Record<string, number>>({});




  useEffect(() => {
    const fetchComunicacaos = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        const accessToken = token ? token.split('=')[1] : null;
    
        if (!accessToken) {
          throw new Error('Token não encontrado');
        }

        const comunicacaosResponse = await fetch('http://localhost:8081/comunicacao', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,  // Correção aqui para interpolar corretamente o token
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!comunicacaosResponse.ok) {
          throw new Error(`Erro ao buscar comunicacaos: ${comunicacaosResponse.status} - ${comunicacaosResponse.statusText}`);
        }

        const data = await comunicacaosResponse.json();
        setComunicacaos(data);  // Armazenando as comunicações recebidas no estado

      } catch (error) {
        setError((error as Error).message);
        console.error('Erro na requisição:', error);
      }
    };

    //Inicio Função para contar por status

    type StatusComunicacao =
      | "Aguardando notificar aluno"
      | "Aguardando resposta do aluno"
      | "Aguardando parecer do Cmt da Cia"
      | "Aguardando parecer do Cmt do CA"
      | "Aguardando parecer do Subcomando"
      | "Comunicação publicada";

    const statusCounts: Record<StatusComunicacao, number> = {
      "Aguardando notificar aluno": 0,
      "Aguardando resposta do aluno": 0,
      "Aguardando parecer do Cmt da Cia": 0,
      "Aguardando parecer do Cmt do CA": 0,
      "Aguardando parecer do Subcomando": 0,
      "Comunicação publicada": 0,
    };

    comunicacaos.forEach(c => {
      if (c.status && statusCounts.hasOwnProperty(c.status)) {
        statusCounts[c.status as StatusComunicacao] = (statusCounts[c.status as StatusComunicacao] || 0) + 1;
      }
    });


    const fetchConcluidas = async () => {
      try {
        const res = await axios.get('http://localhost:8081/comunicacao/comunicacao-concluidas');
        setConcluidas(res.data);
      } catch (err) {
        console.error('Erro ao buscar comunicações Concluidas:', err);
      }
    };
    fetchConcluidas();


    const fetchPublicadas = async () => {
      try {
        const res = await axios.get('http://localhost:8081/comunicacao/comunicacao-publicadas');
        setPublicadas(res.data);
      } catch (err) {
        console.error('Erro ao buscar comunicações Publicadas:', err);
      }
    };
    fetchPublicadas();

    const fetchAguardandoPublicacao = async () => {
      try {
        const res = await axios.get('http://localhost:8081/comunicacao/comunicacao-aguardando-publicacao');
        setAguardandoPublicacao(res.data);
      } catch (err) {
        console.error('Erro ao buscar comunicações Aguardando Publicacao:', err);
      }
    };
    fetchAguardandoPublicacao();


    const fetchEmTramitacao = async () => {
      try {
        const res = await axios.get('http://localhost:8081/comunicacao/contar-em-tramitacao');
        setEmTramitacao(res.data);
      } catch (err) {
        console.error('Erro ao buscar comunicações em tramitação:', err);
      }
    };
    fetchEmTramitacao();

    const fetchStatusPorCia = async () => {
      try {
        const res = await axios.get('http://localhost:8081/comunicacao/contar-status-cia');
        setStatusPorCia(res.data);
      } catch (error) {
        console.error('Erro ao buscar status por cia:', error);
      }
    };
    fetchStatusPorCia();

    const fetchPorCia = async () => {
      try {
        const res = await axios.get('http://localhost:8081/comunicacao/contar-cia');
        setPorCia(res.data);
      } catch (error) {
        console.error('Erro ao buscar o total das cia:', error);
      }
    };
    fetchPorCia();

    
    fetchComunicacaos();
  }, []);  // Certificando-se de que a requisição seja feita uma vez, ao montar o componente

  // Função para redirecionar para a página de detalhes
const handleView = (id: number) => {
  //console.log(`Redirecionando para ver a comunicacao com ID: ${id}`);
  router.push(`/comunicacaover/${id}`);  // Certifique-se de que a URL está correta
};


const handleSubmitEnquadramento = async (id: number) => {
  const comunicacao = comunicacaos.find(com => com.id === id);

  if (!comunicacao) {
    alert('Comunicação não encontrada.');
    return;
  }

  if (!grauMotivo || grauMotivo.trim() === "") {
    alert("O valor do Grau não pode ser vazio.");
    return;
  }

  if (!enquadramento || enquadramento.trim() === "") {
    alert("O valor do enquadramento não pode ser vazio.");
    return;
  }

  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

    const response = await fetch(`http://localhost:8081/comunicacao/aguardando-resposta/${comunicacao.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grauMotivo: Number(grauMotivo), enquadramento: String(enquadramento) }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        alert('Erro 404: Comunicação não encontrada no backend.');
      } else {
        alert(`Erro ao enviar. Código: ${response.status}`);
      }
      return;
    }

    const data = await response.json();

    setComunicacaos(prev =>
      prev.map(com =>
        com.id === data.id
          ? { ...com, ...data }
          : com
      )
    );

    alert('Enquadramento enviado com sucesso!');
    setIsModalOpen(false);
    setgrauMotivo('');
    setenquadramento('');
    setSelectedComunicacaoId(null);

  } catch (error) {
    console.error('Erro ao enviar o Enquadramento:', error);
    alert('Erro ao conectar com o servidor.');
  }
};

const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);

const filtrarPorStatus = (status: string) => {
  setFiltro(status.toLowerCase());
  setFiltroAtivo(status); // Guarda o filtro ativo com exata capitalização
};

const limparFiltro = () => {
  setFiltro("");         // Limpa o texto de busca
  setFiltroAtivo(null);  // Remove o destaque do botão filtrado
};


const comunicacoesFiltradas = comunicacaos.filter((comunicacao) => {
  const textoBusca = filtro.toLowerCase();

  return (
    comunicacao.usercom?.nomeGuerra?.toLowerCase().includes(textoBusca) ||
    comunicacao.useral?.nomeGuerra?.toLowerCase().includes(textoBusca) ||
    comunicacao.useral?.aluno?.turma.cia.name.toLowerCase().includes(textoBusca) ||
    comunicacao.usercmtcia?.nomeGuerra?.toLowerCase().includes(textoBusca) ||
    comunicacao.descricaoMotivo?.toLowerCase().includes(textoBusca) ||
    comunicacao.parecerCmtCia?.toLowerCase().includes(textoBusca) ||
    comunicacao.status?.toLowerCase().includes(textoBusca)
  );
});


  return (
    <div className={styles.conteudoPagina}>
      <div className={styles.comunicacaoPagina}>
      {error && <p>{error}</p>}
          <h1 className={styles.tituloListar}>Comunicações</h1>

          <div className={styles.menuBotoesComunicacaoVer}>

            <button
              className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "Aguardando resposta do aluno" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("Aguardando resposta do aluno")}>
              <i className={`fa fa-mortar-board ${styles.menuIconsComunicacaoVer}`} title="Aguardando resposta do aluno" style={{ color: '#1831d2' }}></i>
            </button>

            <button className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "1ª CIA" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("1ª CIA")}>
              <i className={`fa fa-cube ${styles.menuIconsComunicacaoVer}`} title="1ª CIA" style={{ color: '#18ac22' }}></i>
            </button>

            <button className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "2ª CIA" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("2ª CIA")}>
              <i className={`fa fa-cube ${styles.menuIconsComunicacaoVer}`} title="2ª CIA" style={{ color: '#18ac22' }}></i>
            </button>

            <button className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "3ª CIA" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("3ª CIA")}>
              <i className={`fa fa-cube ${styles.menuIconsComunicacaoVer}`} title="3ª CIA" style={{ color: '#18ac22' }}></i>
            </button>

            <button className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "Aguardando parecer do Cmt do Ca" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("Aguardando parecer do Cmt do Ca")}>
              <i className={`fa fa-cubes ${styles.menuIconsComunicacaoVer}`} title="Aguardando parecer do Cmt do Ca" style={{ color: '#ff000d' }}></i>
            </button>

            <button className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "Aguardando parecer do Subcomando" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("Aguardando parecer do Subcomando")}>
              <i className={`fa fa-star ${styles.menuIconsComunicacaoVer}`} title="Aguardando parecer do Subcomando" style={{ color: '#ffbb00' }}></i>
            </button>

            <button className={`${styles.botoesComunicacaoVer} ${filtroAtivo === "Comunicação publicada" ? styles.botaoAtivo : ''}`}
              onClick={() => filtrarPorStatus("Comunicação publicada")}>
              <i className={`fa fa-book ${styles.menuIconsComunicacaoVer}`} title="Comunicação publicada" style={{ color: '#b40ce2' }}></i>
            </button>

            <button
              className={`${styles.botoesComunicacaoVer} ${filtroAtivo === null ? styles.botaoAtivo : ''}`}
              onClick={limparFiltro}
            >
              <i className={`fa fa-list ${styles.menuIconsComunicacaoVer}`} title="Limpar filtro" style={{ color: '#000000' }}></i>
            </button>
            
          </div>

        <div className={styles.navTituloListar}>
          
          <div className={styles.itensTituloListar}>
            <h1 className={styles.priTituloItemListar}>Comunicações Concluídas</h1>
            <h1 className={styles.segTituloItemListar}>{qtdConcluidas}</h1>
            <h1 className={styles.terTituloItemListar}>Em Tramitação: {emTramitacao}</h1>
          </div>
          
          <div className={styles.itensTituloListar}>
            <h1 className={styles.priTituloItemListar}>Comunicações Publicadas</h1>
            <h1 className={styles.segTituloItemListar}>{qtdPublicadas}</h1>
            <h1 className={styles.terTituloItemListar}>Pendentes : {qtdAguardandoPublicacao}</h1>
          </div>
        
          <div className={styles.itensTituloListar}>
            <h1 className={styles.priTituloItemListar}><i className={`fa fa-cube ${styles.navIcon}`}></i> 1ª CIA</h1>
            <div className={styles.segTituloItemListar}>{qtdPorCia['1ª CIA'] || 0} |
              <h1 className={styles.terTituloItemListar}>
                <i style={{ color: '#ff0000' }} className={`fa fa-pencil ${styles.navIconComunicacaoList}`}></i>
                <span style={{ color: '#ff0000' }}>{statusPorCia['1ª CIA']?.['Aguardando notificar aluno'] || 0}</span> |
                <i className={`fa fa-mortar-board ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Aguardando resposta do aluno'] || 0} |
                <i style={{ color: '#ff0000' }} className={`fa fa-long-arrow-right ${styles.navIconComunicacaoList}`}></i>
                <span style={{ color: '#ff0000' }}>{statusPorCia['1ª CIA']?.['Aguardando enviar ao Cmt da Cia'] || 0}</span> |
                <i className={`fa fa-cube ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Aguardando parecer do Cmt da Cia'] || 0} |
                <i className={`fa fa-cubes ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Aguardando parecer do Cmt do CA'] || 0} | 
                <i className={`fa fa-star ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Aguardando parecer do Subcomando'] || 0} <br></br>
                <i className={`fa fa-archive ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Comunicação arquivada'] || 0} |
                <i className={`fa fa-book ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Aguardando publicação'] || 0} |
                <i className={`fa fa-folder-open ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['1ª CIA']?.['Comunicação publicada'] || 0}
              </h1>
            </div> 
          </div>

          <div className={styles.itensTituloListar}>
            <h1 className={styles.priTituloItemListar}><i className={`fa fa-cube ${styles.navIcon}`}></i> 2ª CIA</h1>
            <div className={styles.segTituloItemListar}>{qtdPorCia['2ª CIA'] || 0} |
              <h1 className={styles.terTituloItemListar}>
                <i style={{ color: '#ff0000' }} className={`fa fa-pencil ${styles.navIconComunicacaoList}`}></i>
                <span style={{ color: '#ff0000' }}>{statusPorCia['2ª CIA']?.['Aguardando notificar aluno'] || 0}</span> |
                <i className={`fa fa-mortar-board ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Aguardando resposta do aluno'] || 0} |
                <i style={{ color: '#ff0000' }} className={`fa fa-long-arrow-right ${styles.navIconComunicacaoList}`}></i>
                <span style={{ color: '#ff0000' }}>{statusPorCia['2ª CIA']?.['Aguardando enviar ao Cmt da Cia'] || 0}</span> |
                <i className={`fa fa-cube ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Aguardando parecer do Cmt da Cia'] || 0} |
                <i className={`fa fa-cubes ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Aguardando parecer do Cmt do CA'] || 0} | 
                <i className={`fa fa-star ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Aguardando parecer do Subcomando'] || 0} <br></br>
                <i className={`fa fa-archive ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Comunicação arquivada'] || 0} |
                <i className={`fa fa-book ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Aguardando publicação'] || 0} |
                <i className={`fa fa-folder-open ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['2ª CIA']?.['Comunicação publicada'] || 0}
              </h1>
            </div> 
          </div>

          <div className={styles.itensTituloListar}>
            <h1 className={styles.priTituloItemListar}><i className={`fa fa-cube ${styles.navIcon}`}></i> 3ª CIA</h1>
            <div className={styles.segTituloItemListar}>{qtdPorCia['3ª CIA'] || 0} |
              <h1 className={styles.terTituloItemListar}>
                <i style={{ color: '#ff0000' }} className={`fa fa-pencil ${styles.navIconComunicacaoList}`}></i>
                <span style={{ color: '#ff0000' }}>{statusPorCia['3ª CIA']?.['Aguardando notificar aluno'] || 0}</span> |
                <i className={`fa fa-mortar-board ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['3ª CIA']?.['Aguardando resposta do aluno'] || 0} |
                <i style={{ color: '#ff0000' }} className={`fa fa-long-arrow-right ${styles.navIconComunicacaoList}`}></i>
                <span style={{ color: '#ff0000' }}>{statusPorCia['3ª CIA']?.['Aguardando enviar ao Cmt da Cia'] || 0}</span> |
                <i className={`fa fa-cube ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['3ª CIA']?.['Aguardando parecer do Cmt da Cia'] || 0} |
                <i className={`fa fa-cubes ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['ª CIA']?.['Aguardando parecer do Cmt do CA'] || 0} | 
                <i className={`fa fa-star ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['3ª CIA']?.['Aguardando parecer do Subcomando'] || 0} <br></br>
                <i className={`fa fa-archive ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['3ª CIA']?.['Comunicação arquivada'] || 0} |
                <i className={`fa fa-book ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['3ª CIA']?.['Aguardando publicação'] || 0} |
                <i className={`fa fa-folder-open ${styles.navIconComunicacaoList}`}></i>
                {statusPorCia['3ª CIA']?.['Comunicação publicada'] || 0}
              </h1>
            </div> 
          </div>
          
        </div>

            {comunicacaos.length > 0 ? (
              <div>
                  <h1 className={styles.tituloTabelaListar}>COMUNICAÇÕES</h1>
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      style={{
                        padding: "0.5rem",
                        width: "100%",
                        maxWidth: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "20px"
                      }}
                    />
                <table className={styles.tabelaComunicacao}>
                  <thead>
                    <tr>
                      <th className={styles.thComunicacaoHeader}><i className={`fa fa-pencil ${styles.navIconComunicacaoHeader}`}></i>Comunicante</th>
                      <th className={styles.thComunicacaoHeader}><i className={`fa fa-mortar-board ${styles.navIconComunicacaoHeader}`}></i>Aluno</th>
                      <th className={styles.thComunicacaoHeader}><i className={`fa fa-cube ${styles.navIconComunicacaoHeader}`}></i>Cmt Cia</th>
                      <th className={styles.thComunicacaoHeader}><i className={`fa fa-cubes ${styles.navIconComunicacaoHeader}`}></i>Cmt CA</th>
                      <th className={styles.thComunicacaoHeader}><i className={`fa fa-star ${styles.navIconComunicacaoHeader}`}></i>SubComando</th>
                      <th className={styles.thComunicacaoHeader}><i className={`fa fa-folder ${styles.navIconComunicacaoHeader}`}></i>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {comunicacoesFiltradas.map(comunicacao => {
                      return (
                        <tr key={comunicacao.id} onClick={() => handleView(comunicacao.id)}>
                          <td>
                            <div>
                              <Image src="/assets/images/avatar.png" alt="user" width={40} height={40} />
                            </div>
                            <div>
                              <p className={styles.pComunicacao}><strong>{comunicacao.usercom?.pg} {comunicacao.usercom?.nomeGuerra} {comunicacao.usercom?.funcao}</strong></p>
                              <p style={{ color: '#ef0a0a' }}><i className={`fa fa-check-square`}></i> <strong>{comunicacao.motivo ? truncateText(comunicacao.motivo, 35) : '-'}</strong> | {comunicacao.grauMotivo} Pts - {comunicacao.natureza}</p>
                              <p><strong>Descrição:</strong> {comunicacao.descricaoMotivo ? truncateText(comunicacao.descricaoMotivo, 30) : '-'}</p>
                              <p><strong>{new Date(comunicacao.dataCom).toLocaleString()}</strong></p>
                            </div>
                          </td>

                          <td>
                            <div>
                              <Image src="/assets/images/avatar.png" alt="user" width={40} height={40} />
                            </div>
                            <div>
                              <p className={styles.pComunicacao}><strong>{comunicacao.useral?.pg} {comunicacao.useral?.nomeGuerra} | {comunicacao.useral?.aluno?.turma.name} {comunicacao.useral?.aluno?.turma.cia.name}</strong></p>
                              <p><strong>Resposta do Aluno:</strong> {comunicacao.resposta ? truncateText(comunicacao.resposta, 50) : '-'}</p>
                              <p><strong>{comunicacao.dataResp ? new Date(comunicacao.dataResp).toLocaleString() : '-'}</strong></p>
                            </div>
                          </td>

                          <td>
                            <div>
                              <Image src="/assets/images/avatar.png" alt="user" width={40} height={40} />
                            </div>
                            <div>
                              <p className={styles.pComunicacao}><strong>{comunicacao.usercmtcia?.pg} {comunicacao.usercmtcia?.nomeGuerra} {comunicacao.usercmtcia?.funcao}</strong></p>
                              <p><strong>Cmt da Cia:</strong> {comunicacao.parecerCmtCia ? truncateText(comunicacao.parecerCmtCia, 60) : '-'}</p>
                              <p><strong>{comunicacao.dataParecerCmtCia ? new Date(comunicacao.dataParecerCmtCia).toLocaleString() : '-'}</strong></p>
                            </div>
                          </td>

                          <td>
                            <div>
                              <Image src="/assets/images/avatar.png" alt="user" width={40} height={40} />
                            </div>
                            <div>
                              <p className={styles.pComunicacao}><strong>{comunicacao.userca?.pg} {comunicacao.userca?.nomeGuerra} {comunicacao.userca?.funcao}</strong></p>
                              <p><strong>Cmt do CA:</strong> {comunicacao.parecerCa ? truncateText(comunicacao.parecerCa, 60) : '-'}</p>
                              <p><strong>{comunicacao.dataParecerCa ? new Date(comunicacao.dataParecerCa).toLocaleString() : '-'}</strong></p>
                            </div>
                          </td>

                          <td>
                            <div>
                              <Image src="/assets/images/avatar.png" alt="user" width={40} height={40} />
                            </div>
                            <div>
                              <p className={styles.pComunicacao}><strong>{comunicacao.usersubcom?.pg} {comunicacao.usersubcom?.nomeGuerra} {comunicacao.usersubcom?.funcao}</strong></p>
                              <p><strong>SubCom:</strong> {comunicacao.parecerSubcom ? truncateText(comunicacao.parecerSubcom, 60) : '-'}</p>
                              <p><strong>{comunicacao.dataParecerSubcom ? new Date(comunicacao.dataParecerSubcom).toLocaleString() : '-'}</strong></p>
                            </div>
                          </td>

                          <td>
                            <div>
                            <div>
                              <Image src="/assets/images/logo.png" alt="user" width={40} height={40} />
                            </div> <br></br>
                              <p style={{ color: '#4c39f6' }}><strong>Situação:</strong> {comunicacao.status ? comunicacao.status : '-'}</p>
                              <p><strong>{comunicacao.dtAtualizacaoStatus ? new Date(comunicacao.dtAtualizacaoStatus).toLocaleString() : '-'}</strong></p>
                              <p><strong>CV: Não Informado</strong></p>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Não há comunicações para exibir.</p>
            )}
      </div>

      {/* Inicio Modal Enquadramento */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.tituloListar}>Enquadramento</h2>

              <h3>Informe o valor total do enquadramento</h3>
              <input
                className={styles.inputEnquadramento}
                type='number'
                placeholder="Ex: 0.5 ou 1.5"
                value={grauMotivo}
                onChange={(e) => setgrauMotivo(e.target.value)}
              />

              <h3>Descreva o motivo do enquadramento</h3>
              <textarea
                placeholder="Ex: Uma atenuante e duas agravantes..."
                value={enquadramento}
                onChange={(e) => setenquadramento(e.target.value)}
                className={styles.inputEnquadramentoTextarea}
                rows={3}
                maxLength={70}
              />
              {/* Contador de caracteres */}
              <div className={styles.charCounter}>
                {enquadramento.length} / 70 caracteres
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => selectedComunicacaoId && handleSubmitEnquadramento(selectedComunicacaoId)}
                  className={styles.enviarRespBtn}
                >
                  Enviar
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelarBtn}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      {/* Fim Modal Enquadramento */}

    </div>
  );
};

export default ComunicacaosPage;
