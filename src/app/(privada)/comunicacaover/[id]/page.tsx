'use client';

import styles from '../../privateLayout.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams para pegar os parâmetros de URL no App Router
import Image from 'next/image';


interface ComunicacaoDetalhe {
  id: number;
  userIdCom: number;
  motivo: string;
  descricaoMotivo: string;
  natureza: string | null;
  grauMotivo: number;
  enquadramento: string | null;
  dataCom: string;

  userIdArquivamento: number | null;
  motivoArquivamento: string | null;

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
          id: number;
          userId: number;
          resp1: string;
          resp2: string;
          grauInicial:number;
          grauAtual:number;
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
  userarquivador?: {
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

const ComunicacaoDetalhePage = () => {
    const [userLogin, setUserLogin] = useState<UserLogin | null>(null); // Inicialmente null
    const [comunicacao, setComunicacao] = useState<ComunicacaoDetalhe | null>(null);
    const { id } = useParams(); // Use useParams para acessar o id da URL, ao invés de router.query
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parecerCmtCia, setparecerCmtCia] = useState('');
    const [isModalOpenParecerCa, setIsModalOpenParecerCa] = useState(false);
    const [parecerCa, setparecerCa] = useState('');
    const [isModalOpenParecerSubcom, setIsModalOpenParecerSubcom] = useState(false);
    const [parecerSubcom, setparecerSubcom] = useState('');
    const [grauMotivo, setgrauMotivo] = useState('');
    const [natureza, setnatureza] = useState('');
    const [isModalOpenEnquadramento, setIsModalOpenEnquadramento] = useState(false);
    const [enquadramento, setenquadramento] = useState('');
    const [isModalOpenArquivamento, setIsModalOpenArquivamento] = useState(false);
    const [motivoArquivamento, setmotivoArquivamento] = useState('');



    const statusNotificarAluno = [
      "Aguardando resposta do aluno",
      "Aguardando enviar ao Cmt da Cia",
      "Comunicação arquivada",
      "Aguardando parecer do Cmt da Cia",
      "Aguardando parecer do Cmt do CA",
      "Aguardando parecer do Subcomando",
      "Aguardando publicação",
      "Comunicação publicada"
    ];

    const statusEnvioCmtCia = [
      "Aguardando parecer do Cmt da Cia",
      "Aguardando parecer do Cmt do CA",
      "Aguardando parecer do Subcomando",
      "Aguardando publicação",
      "Comunicação arquivada",
      "Comunicação publicada"
    ];

    const statusParecerCmtCia = [
      "Aguardando parecer do Cmt do CA",
      "Aguardando parecer do Subcomando",
      "Aguardando publicação",
      "Comunicação arquivada",
      "Comunicação publicada"
    ];

    const statusArquivarComunicacao = [
      "Aguardando publicação",
      "Comunicação arquivada",
      "Comunicação publicada"
    ];

    const statusEnvioCa = [
      "Aguardando parecer do Cmt da Cia",
      "Aguardando parecer do Subcomando",
      "Aguardando publicação",
      "Comunicação arquivada",
      "Comunicação publicada"
    ];

    const statusEnvioSubcom = [
      "Aguardando parecer do Cmt da Cia",
      "Aguardando parecer do Cmt do CA",
      "Aguardando publicação",
      "Comunicação arquivada",
      "Comunicação publicada"
    ];

    const statusPublicarComunicacao = [
      "Aguardando notificar aluno",
      "Aguardando resposta do aluno",
      "Aguardando enviar ao Cmt da Cia",
      "Comunicação arquivada",
      "Aguardando parecer do Cmt da Cia",
      "Aguardando parecer do Cmt do CA",
      "Aguardando parecer do Subcomando",
      "Comunicação publicada"
    ];


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
      fetch(`http://localhost:8081/comunicacao/${id}`)
        .then((response) => response.json())
        .then((data) => setComunicacao(data))
        .catch((error) => {
          console.error('Erro ao carregar os detalhes do aluno:', error);
        });
    }
  }, [id]);
  if (!comunicacao) return <div>Carregando...</div>;

  const handleSubmitEnquadramento = async () => {
    if (!comunicacao) {
      alert('Comunicação não encontrada.');
      return;
    }
  
    if (!grauMotivo.trim()) {
      alert("O valor do Grau não pode ser vazio.");
      return;
    }
  
    if (!enquadramento.trim()) {
      alert("O valor do enquadramento não pode estar vazio.");
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
        body: JSON.stringify({
          grauMotivo: Number(grauMotivo),
          enquadramento: String(enquadramento),
          natureza: String(natureza),
        }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Erro 404: Comunicação não encontrada no backend.');
        } else {
          alert(`Erro ao enviar. Código: ${response.status}`);
        }
        return;
      }
  
      // Após PUT, refaz o GET para atualizar a comunicação completamente
      const getResponse = await fetch(`http://localhost:8081/comunicacao/${comunicacao.id}`);
      const updatedData = await getResponse.json();
      setComunicacao(updatedData);
  
      alert('Enquadramento enviado com sucesso!');
      setIsModalOpenEnquadramento(false);
      setgrauMotivo('');
      setnatureza('');
      setenquadramento('');
    } catch (error) {
      console.error('Erro ao enviar o Enquadramento:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleViewEnviarCmtCia = async (id: number) => {
    if (!comunicacao) {
      alert('Comunicação não encontrada.');
      return;
    }
  
    if (!comunicacao.resposta || comunicacao.resposta.trim() === "") {
      const confirmar = window.confirm("Não há resposta do aluno. Deseja enviar ao Cmt da Cia?");
      if (!confirmar) {
        return;
      }
    }

    const confirmarEnvio = window.confirm("Deseja disponibilizar ao Cmt da Cia?");
    if (!confirmarEnvio) {
    return;
    }
  
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
  
      const response = await fetch(`http://localhost:8081/comunicacao/enviar-cmtcia/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao atualizar status: ${response.status}`);
      }
  
      const data = await response.json();
      alert('Status atualizado com sucesso!');
  
      setComunicacao({
        ...comunicacao,
        status: data.status,
        dtAtualizacaoStatus: data.dtAtualizacaoStatus,
      });
  
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status da comunicação.');
    }
  };

  const handleViewArquivarComunicacao = async (id: number) => {
    if (!comunicacao) {
      alert('Comunicação não encontrada.');
      return;
    }
  
    const confirmarArquivamento = window.confirm("Deseja arquivar essa comunicação?");
    if (!confirmarArquivamento) {
    return;
    }
  
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

      if (!userLogin) {
        alert('Usuário não está logado');
        return;
      }
  
      const response = await fetch(`http://localhost:8081/comunicacao/arquivar/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIdArquivamento: userLogin.id,
          motivoArquivamento: String(motivoArquivamento),
        }),
      });

  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Erro 404: Comunicação não encontrada no backend.');
        } else {
          alert(`Erro ao enviar. Código: ${response.status}`);
        }
        return;
      }
  
      // Após PUT, refaz o GET para atualizar a comunicação completamente
      const getResponse = await fetch(`http://localhost:8081/comunicacao/${comunicacao.id}`);
      const updatedData = await getResponse.json();
      setComunicacao(updatedData);
  
      alert('Arquivamento realizado com sucesso!');
      setIsModalOpenArquivamento(false);
      setmotivoArquivamento('');
    } catch (error) {
      console.error('Erro ao tentar arquivar a comunicação:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };
  
  const handleSubmitparecerCmtCia = async () => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }
  
    if (!userLogin) {
      alert("Usuário logado não identificado.");
      return;
    }
  
    if (!parecerCmtCia || parecerCmtCia.trim() === "") {
      alert("O Parecer não pode estar vazio.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8081/comunicacao/opinioes/${comunicacao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parecerCmtCia,
          userIdCmtCia: userLogin.id,
         }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Erro 404: Comunicação não encontrada no backend.');
        } else {
          alert(`Erro ao enviar o Parecer. Código: ${response.status}`);
        }
        return;
      }
  
      const data = await response.json();
      alert('Parecer enviado com sucesso!');
      setIsModalOpen(false);
      setparecerCmtCia('');
  
      // Atualiza os dados da comunicação após a resposta
      fetch(`http://localhost:8081/comunicacao/${comunicacao.id}`)
        .then((res) => res.json())
        .then((dataAtualizada) => setComunicacao(dataAtualizada));
  
    } catch (error) {
      console.error('Erro ao enviar Parecer:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleSubmitparecerCa = async () => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }
  
    if (!userLogin) {
      alert("Usuário logado não identificado.");
      return;
    }
  
    if (!parecerCa || parecerCa.trim() === "") {
      alert("O Parecer não pode estar vazio.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8081/comunicacao/parecerca/${comunicacao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parecerCa,
          userIdCa: userLogin.id,
         }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Erro 404: Comunicação não encontrada no backend.');
        } else {
          alert(`Erro ao enviar parecer do CA. Código: ${response.status}`);
        }
        return;
      }
  
      const data = await response.json();
      alert('Parecer do CA enviado com sucesso!');
      setIsModalOpenParecerCa(false);
      setparecerCa('');
  
      // Atualiza os dados da comunicação após a resposta
      fetch(`http://localhost:8081/comunicacao/${comunicacao.id}`)
        .then((res) => res.json())
        .then((dataAtualizada) => setComunicacao(dataAtualizada));
  
    } catch (error) {
      console.error('Erro ao enviar parecer do CA:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleSubmitparecerSubcom = async () => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }
  
    if (!userLogin) {
      alert("Usuário logado não identificado.");
      return;
    }
  
    if (!parecerSubcom || parecerSubcom.trim() === "") {
      alert("O Parecer não pode estar vazio.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8081/comunicacao/parecersubcom/${comunicacao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parecerSubcom,
          userIdSubcom: userLogin.id,
         }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Erro 404: Comunicação não encontrada no backend.');
        } else {
          alert(`Erro ao enviar parecer do Subcom. Código: ${response.status}`);
        }
        return;
      }
  
      const data = await response.json();
      alert('Parecer do Subcom enviado com sucesso!');
      setIsModalOpenParecerSubcom(false);
      setparecerSubcom('');
  
      // Atualiza os dados da comunicação após a resposta
      fetch(`http://localhost:8081/comunicacao/${comunicacao.id}`)
        .then((res) => res.json())
        .then((dataAtualizada) => setComunicacao(dataAtualizada));
  
    } catch (error) {
      console.error('Erro ao enviar parecer do CA:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleViewPublicarComunicacao = async (id: number) => {
    if (!comunicacao) {
      alert('Comunicação não encontrada.');
      return;
    }
  
    const confirmarPublicacao = window.confirm("Deseja Realmente Publicar essa Comunicação?");
    if (!confirmarPublicacao) {
    return;
    }
  
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
  
      const response = await fetch(`http://localhost:8081/comunicacao/publicar/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao atualizar status: ${response.status}`);
      }
  
      const data = await response.json();
      alert('Comunicação Publicada com Sucesso!');
  
      setComunicacao({
        ...comunicacao,
        status: data.status,
        dtAtualizacaoStatus: data.dtAtualizacaoStatus,
      });
  
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status da comunicação.');
    }
  };

  return (
      <div className={styles.conteudoPagina}>
        <div className={styles.menuBotoesComunicacaoVer}>

            {statusNotificarAluno.includes(comunicacao.status) ? (
              <button  className={styles.botoesComunicacaoVer}>
                <i className={`fa fa-mortar-board ${styles.menuIconsComunicacaoVer}`} title="Aluno Notificado" style={{ color: '#b3aeae' }}></i>
              </button>
              ) : (
              <button
                className={styles.botoesComunicacaoVer}
                onClick={() => setIsModalOpenEnquadramento(true)}
                style={{ cursor: "pointer" }}
              >
                <i className={`fa fa-mortar-board ${styles.menuIconsComunicacaoVer}`} title="Notificar Aluno" style={{ color: '#1831d2' }}></i>
              </button>
            )}

            {statusEnvioCmtCia.includes(comunicacao.status) ? (
              <button  className={styles.botoesComunicacaoVer}>
                <i className={`fa fa-cube ${styles.menuIconsComunicacaoVer}`} title="Enviado ao Cmt da Cia" style={{ color: '#b3aeae' }}></i>
              </button>
              ) : (
              <button
                className={styles.botoesComunicacaoVer}
                onClick={() => handleViewEnviarCmtCia(comunicacao.id)}
                style={{ cursor: "pointer" }}
              >
                <i className={`fa fa-cube ${styles.menuIconsComunicacaoVer}`} title="Enviar ao Cmt da Cia" style={{ color: '#18ac22' }}></i>
              </button>
            )}


            {statusArquivarComunicacao.includes(comunicacao.status) ? (
              <button  className={styles.botoesComunicacaoVer}>
                <i className={`fa fa-archive ${styles.menuIconsComunicacaoVer}`} title="Arquivar Comunicação" style={{ color: '#b3aeae' }}></i>
              </button>
              ) : (
              <button
                className={styles.botoesComunicacaoVer}
                onClick={() => setIsModalOpenArquivamento(true)}
                style={{ cursor: "pointer" }}
              >
                <i className={`fa fa-archive ${styles.menuIconsComunicacaoVer}`} title="Arquivar Comunicação" style={{ color: '#ffbb00' }}></i>
              </button>
            )}
            
            {statusPublicarComunicacao.includes(comunicacao.status) ? (
                <button  className={styles.botoesComunicacaoVer}>
                  <i className={`fa fa-book ${styles.menuIconsComunicacaoVer}`} title="Publicar Comunicação" style={{ color: '#b3aeae' }}></i>
                </button>
                ) : (

                <button
                  className={styles.botoesComunicacaoVer}
                  onClick={() => handleViewPublicarComunicacao(comunicacao.id)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`fa fa-book ${styles.menuIconsComunicacaoVer}`} title="Publicar Comunicação" style={{ color: '#b40ce2' }}></i>
                </button>
            )}

            <button  className={styles.botoesComunicacaoVer}>
              <i className={`fa fa-file-pdf ${styles.menuIconsComunicacaoVer}`} title="Gerar Pdf" style={{ color: '#ff3300' }}></i>
            </button>
        </div>
        <div className={styles.comunicacaoPagina}>
          <div className={styles.tituloComunicacao}>
              <h1 className={styles.andamento}><strong>Comunicação de Aluno</strong></h1>
          </div>

          {/* CONTEDUDO DA LOGO */}

          <div className={styles.divUserImagePerfil}>
            <Image src="/assets/images/logo.png" alt="Logo" width={100} height={100} />
            <div className={styles.userInfoPerfil}>
              <span className={styles.userNamePerfil}>
              Colegio da Policia Militar
              </span>
            </div>
            <div>
              <span className={styles.userFuncaoComunicacao}>
                Av Barão de Souza, Ilha do Leite, Recife - PE
              </span>
              <br />
              <span className={styles.userFuncaoComunicacao}>
                E-mail: colegiodapoliciamilitar@pm.pe.giv.br
              </span>
            </div>
          </div>

          {/* CONTEDUDO DA LOGO */}
          <div className={styles.profileDetails}>
            {/* Bloco identificação do aluno */}
              <h1 className={styles.inputRespostaH1}>Identifiação</h1>
              <div className={styles.comunicacaoPagina}>
                <ul>
                  <li>
                    <i className={`fa fa-user ${styles.navIcon}`}></i> {comunicacao.useral?.name}
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.useral?.funcao}
                  </li>
                  <li>
                    <div>
                      Responsaveis: <br></br>
                      <i className={`fa fa-user ${styles.navIcon}`}></i><strong>{comunicacao.useral?.aluno?.resp1 || 'Resposnsavel não informado'}</strong> <br></br>
                      <i style={{ color: '#ccc5c5' }} className={`fa fa-phone ${styles.navIcon}`}></i>{comunicacao.useral?.phone} <br></br>
                      <i className={`fa fa-user ${styles.navIcon}`}></i><strong>{comunicacao.useral?.aluno?.resp2 || 'Resposnsavel não informado'}</strong> <br></br>
                      <i style={{ color: '#ccc5c5' }} className={`fa fa-phone ${styles.navIcon}`}></i>{comunicacao.useral?.phone} <br></br>
                    </div>
                  </li>
                  <li>
                    <i className={`fa fa-cube ${styles.navIcon}`}></i> Turma: 
                    <i className={`${styles.rightIcon}`}></i>
                    <strong>{comunicacao.useral?.aluno?.turma.name}</strong>
                  </li>
                  <li>
                    <i className={`fa fa-cubes ${styles.navIcon}`}></i> Cia: 
                    <i className={`${styles.rightIcon}`}></i>
                    <strong>{comunicacao.useral?.aluno?.turma.cia.name}</strong>
                  </li>
                  <li>
                    <i className={`fa fa-line-chart ${styles.navIcon}`}></i> Comportamento: 
                    <i className={`${styles.rightIcon}`}></i>
                    <strong>{comunicacao.useral?.aluno?.grauAtual}</strong>
                  </li>
                </ul>
              </div>
              <br></br>
            {/* Bloco identificação do aluno */}

            {/* Bloco Cad comunicacao do aluno */}
              <h1 className={styles.inputRespostaH1}>I - Comunicação</h1>
              <div className={styles.comunicacaoPagina}>
                <ul>
                  <li>
                    <i className={`fa fa-user ${styles.navIcon}`}></i> <strong>{comunicacao.usercom?.pg} {comunicacao.usercom?.nomeGuerra}</strong>
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.usercom?.funcao}
                  </li>
                  <li>
                    <div className={styles.enquadramento}>
                      <p className={styles.inputRespostaCheck}><i style={{ color: '#ff0000' }} className={`fa fa-check-square`}></i>{comunicacao.motivo} | {comunicacao.grauMotivo} Pts -  {comunicacao.natureza}</p>
                      <p className={styles.labelEnquadramento}><i style={{ color: '#ff0000' }} className={`fa fa-info`}> -</i>{comunicacao.enquadramento}</p>
                    </div>
                  </li>
                  <li>
                    <i className={`fa fa-comment ${styles.navIcon}`}></i>
                    <p> <strong>{comunicacao.descricaoMotivo || 'Descricao do Motivo não informado'}</strong></p>
                  </li>
                  <li>
                    <i className={`${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {new Date(comunicacao.dataCom).toLocaleString()}
                  </li>
                </ul>
              </div>
              <br></br>
            {/* Bloco Cad comunicacao do aluno */}

            {/* Bloco resposta do aluno */}
              <h1 className={styles.inputRespostaH1}>II - Resposta</h1>
              <div className={styles.comunicacaoPagina}>
                <ul>
                  <li>
                    <i className={`fa fa-user ${styles.navIcon}`}></i> <strong>{comunicacao.useral?.pg} {comunicacao.useral?.nomeGuerra}</strong>
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.useral?.funcao}
                  </li>
                  <li>
                    <i className={`fa fa-comment ${styles.navIcon}`}></i>
                    <p>
                      {comunicacao.resposta ? (
                        <strong>{comunicacao.resposta}</strong>
                      ) : (
                        <span style={{ color: '#979494' }}>Aguardando resposta do Aluno</span>
                      )}
                    </p>
                  </li>
                  <li>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataResp ? new Date(comunicacao.dataResp).toLocaleString() : 'Nenhuma data informada'}
                  </li>
                </ul>
              </div>
              <br></br>
            {/* Bloco resposta do aluno */}

            {/* Bloco parecer do Cmt da Cia */}
              <h1 className={styles.inputRespostaH1}>III - Comandante da Companhia</h1>
              <div className={styles.comunicacaoPagina}>
                <ul>
                  <li>
                    <i className={`fa fa-user ${styles.navIcon}`}></i> <strong>{comunicacao.usercmtcia?.pg} {comunicacao.usercmtcia?.nomeGuerra}</strong>
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.usercmtcia?.funcao}
                  </li>
                  <li>
                    <i className={`fa fa-comment ${styles.navIcon}`}></i>
                    <p>
                      {comunicacao.parecerCmtCia ? (
                        <strong>{comunicacao.parecerCmtCia}</strong>
                      ) : (
                        <span style={{ color: '#979494' }}>Parecer não informado</span>
                      )}
                    </p>
                  </li>
                  <li>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataParecerCmtCia ? new Date(comunicacao.dataParecerCmtCia).toLocaleString() : 'Nenhuma data informada'}
                  </li>
                    {/* Verifica se o typeUser é de um Cmt da Cia */}
                    {!comunicacao.parecerCmtCia && userLogin?.typeUser === 6 && !statusParecerCmtCia.includes(comunicacao.status) && (
                      <button className={styles.comunicacaoResp} onClick={() => setIsModalOpen(true)}>
                        Parecer do Cmt da Cia
                      </button>
                    )}
                </ul>
              </div>
              <br></br>
            {/* Bloco parecer do Cmt da Cia */}

            {/* Bloco parecer do Cmt do CA */}
              <h1 className={styles.inputRespostaH1}>IV - Comandante do Corpo de Alunos</h1>
              <div className={styles.comunicacaoPagina}>
                <ul>
                  <li>
                    <i className={`fa fa-user ${styles.navIcon}`}></i> <strong>{comunicacao.userca?.pg} {comunicacao.userca?.nomeGuerra}</strong>
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.userca?.funcao}
                  </li>
                  <li>
                    <i className={`fa fa-comment ${styles.navIcon}`}></i>
                    <p>
                      {comunicacao.parecerCa ? (
                        <strong>{comunicacao.parecerCa}</strong>
                      ) : (
                        <span style={{ color: '#979494' }}>Parecer não informado</span>
                      )}
                    </p>
                  </li>
                  <li>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataParecerCa ? new Date(comunicacao.dataParecerCa).toLocaleString() : 'Nenhuma data informada'}
                  </li>
                  {/* Verifica se o typeUser é de um Cmt da CA */}
                  {!comunicacao.parecerCa && userLogin?.typeUser === 7 && !statusEnvioCa.includes(comunicacao.status) && (
                      <button className={styles.comunicacaoResp} onClick={() => setIsModalOpenParecerCa(true)}>
                        Parecer do Cmt do CA
                      </button>
                    )}
                </ul>
              </div>
              <br></br>
            {/* Bloco parecer do Cmt do CA */}

            {/* Bloco parecer do SubComando */}
              <h1 className={styles.inputRespostaH1}>V - Subcomando</h1>
              <div className={styles.comunicacaoPagina}>
                <ul>
                  <li>
                    <i className={`fa fa-user ${styles.navIcon}`}></i> <strong>{comunicacao.usersubcom?.pg} {comunicacao.usersubcom?.nomeGuerra}</strong>
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.usersubcom?.funcao}
                  </li>
                  <li>
                    <i className={`fa fa-comment ${styles.navIcon}`}></i>
                    <p>
                      {comunicacao.parecerSubcom ? (
                        <strong>{comunicacao.parecerSubcom}</strong>
                      ) : (
                        <span style={{ color: '#979494' }}>Parecer não informado</span>
                      )}
                    </p>
                  </li>
                  <li>
                    <i className={`${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataParecerSubcom ? new Date(comunicacao.dataParecerSubcom).toLocaleString() : 'Nenhuma data informada'}
                  </li>
                  {/* Verifica se o typeUser é de um Cmt da CA */}
                  {!comunicacao.parecerSubcom && userLogin?.typeUser === 8 && !statusEnvioSubcom.includes(comunicacao.status) && (
                      <button className={styles.comunicacaoResp} onClick={() => setIsModalOpenParecerSubcom(true)}>
                        Parecer do Cmt do Subcomando
                      </button>
                    )}
                </ul>
              </div>
              <br></br>
            {/* Bloco parecer do SubComando */}

            {/* Bloco status da comunuicacao */}
              <div>
              <ul>
                <li>
                  <h1>Status da Comunicação</h1>
                </li>
                <li>
                  <i className={`fa fa-check-square ${styles.navIcon}`}></i> <strong>{comunicacao.status}</strong>
                </li>
                {comunicacao.status === "Comunicação arquivada" && (
                  <>
                    <li style={{ display: 'flex', color: '#787777', paddingLeft: '45px' }}>
                      Por:  
                      <span style={{ paddingLeft: '4px', paddingRight: '4px' }}>{comunicacao.userarquivador?.pg}</span> 
                      <span style={{ paddingRight: '4px' }}>{comunicacao.userarquivador?.nomeGuerra}</span> 
                      <span style={{ paddingRight: '4px' }}>{comunicacao.userarquivador?.funcao}</span>
                    </li>
                    <li style={{ color: '#787777', paddingLeft: '45px' }}>
                      Motivo: {comunicacao.motivoArquivamento}
                    </li>
                  </>
                )}
                <li>
                  <i className={` ${styles.navIconResposta}`}></i> 
                  <i className={`${styles.rightIcon}`}></i>
                  {comunicacao.dtAtualizacaoStatus ? new Date(comunicacao.dtAtualizacaoStatus).toLocaleString() : 'Nenhuma data informada'}
                </li>
              </ul>

              </div>
            {/* Bloco status da comunuicacao */}
          </div>
        </div>

        {/* Inicio Modal Enquadramento */}
          {isModalOpenEnquadramento && (
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

                <h3>Natureza da Comunicação</h3>
                <select
                  className={styles.inputEnquadramento}
                  value={natureza}
                  onChange={(e) => setnatureza(e.target.value)}
                >
                  <option value="">Selecione a natureza</option>
                  <option value="Leve">Leve</option>
                  <option value="Media">Média</option>
                  <option value="Grave">Grave</option>
                </select>

                <h3>Descreva o motivo do enquadramento</h3>
                <textarea
                  placeholder="Ex: Uma atenuante e duas agravantes..."
                  value={enquadramento}
                  onChange={(e) => setenquadramento(e.target.value)}
                  className={styles.inputEnquadramentoTextarea}
                  rows={3}
                  maxLength={70}
                />
                <div className={styles.charCounter}>
                  {enquadramento.length} / 70 caracteres
                </div>

                <div className={styles.modalActions}>
                  <button onClick={handleSubmitEnquadramento} className={styles.enviarRespBtn}>
                    Enviar
                  </button>
                  <button onClick={() => setIsModalOpenEnquadramento(false)} className={styles.cancelarBtn}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        {/* Fim Modal Enquadramento */}

        {/* Inicio Modal Parecer Cmt Cia */}
          {isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>Parecer do Cmt da Cia</h2>
                <textarea
                  placeholder="Digite seu Parecer aqui..."
                  value={parecerCmtCia}
                  onChange={(e) => setparecerCmtCia(e.target.value)}
                  className={styles.inputRespostaTextarea}
                  rows={5}
                />
                <div className={styles.modalActions}>
                  <button onClick={handleSubmitparecerCmtCia} className={styles.enviarRespBtn}>Enviar</button>
                  <button onClick={() => setIsModalOpen(false)} className={styles.cancelarBtn}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        {/* Fim Modal Parecer Cmt Cia */}

        {/* Inicio Modal Arquivamento */}
          {isModalOpenArquivamento && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2 className={styles.tituloListar}>Arquivar Comunicação</h2>

                <h3>Informe o motivo do arquivamento</h3>
                <textarea
                  placeholder="Digite o motivo do arquivamento"
                  value={motivoArquivamento}
                  onChange={(e) => setmotivoArquivamento(e.target.value)}
                  className={styles.inputEnquadramentoTextarea}
                  rows={3}
                  maxLength={70}
                />
                
                <div className={styles.modalActions}>
                  <button onClick={() => handleViewArquivarComunicacao(comunicacao.id)} className={styles.enviarRespBtn}>
                    Enviar
                  </button>
                  <button onClick={() => setIsModalOpenArquivamento(false)} className={styles.cancelarBtn}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        {/* Fim Modal Arquivamento */}

        {/* Inicio Modal Parecer CA */}
          {isModalOpenParecerCa && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>Parecer do Cmt do Ca</h2>
                <textarea
                  placeholder="Digite seu Parecer aqui..."
                  value={parecerCa}
                  onChange={(e) => setparecerCa(e.target.value)}
                  className={styles.inputRespostaTextarea}
                  rows={5}
                />
                <div className={styles.modalActions}>
                  <button onClick={handleSubmitparecerCa} className={styles.enviarRespBtn}>Enviar</button>
                  <button onClick={() => setIsModalOpenParecerCa(false)} className={styles.cancelarBtn}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        {/* Fim Modal Parecer CA */}

        {/* Inicio Modal Parecer SubComando */}
          {isModalOpenParecerSubcom && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>Parecer do Cmt do Subcomando</h2>
                <textarea
                  placeholder="Digite seu Parecer aqui..."
                  value={parecerSubcom}
                  onChange={(e) => setparecerSubcom(e.target.value)}
                  className={styles.inputRespostaTextarea}
                  rows={5}
                />
                <div className={styles.modalActions}>
                  <button onClick={handleSubmitparecerSubcom} className={styles.enviarRespBtn}>Enviar</button>
                  <button onClick={() => setIsModalOpenParecerSubcom(false)} className={styles.cancelarBtn}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        {/* Fim Modal Parecer SubComando */}

      </div>
  );

};


export default ComunicacaoDetalhePage;

