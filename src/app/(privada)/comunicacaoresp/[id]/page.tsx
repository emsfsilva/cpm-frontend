'use client';

import styles from '../../privateLayout.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams para pegar os parâmetros de URL no App Router
import Image from 'next/image';
import { log } from 'console';

interface ComunicacaoResp {
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

const ComunicacaoRespPage = () => {

    const [userLogin, setUserLogin] = useState<UserLogin | null>(null); // Inicialmente null
    const [comunicacao, setComunicacao] = useState<ComunicacaoResp | null>(null);
    const { id } = useParams(); // Use useParams para acessar o id da URL, ao invés de router.query
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resposta, setResposta] = useState('');

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
      
      
      fetch(`http://localhost:8081/comunicacao/${id}`)
        .then((response) => response.json())
        .then((data) => setComunicacao(data))
        .catch((error) => {
          console.error('Erro ao carregar os detalhes do aluno:', error);
        });
    }
  }, [id]);

  if (!comunicacao) return <div>Carregando...</div>;

  const handleSubmitResposta = async () => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }
  
    if (!userLogin) {
      alert("Usuário logado não identificado.");
      return;
    }
  
    if (!resposta || resposta.trim() === "") {
      alert("A resposta não pode estar vazia.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8081/comunicacao/responder/${comunicacao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resposta }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Erro 404: Comunicação não encontrada no backend.');
        } else {
          alert(`Erro ao enviar resposta. Código: ${response.status}`);
        }
        return;
      }
  
      const data = await response.json();
      alert('Resposta enviada com sucesso!');
      setIsModalOpen(false);
      setResposta('');
  
      // Atualiza os dados da comunicação após a resposta
      fetch(`http://localhost:8081/comunicacao/${comunicacao.id}`)
        .then((res) => res.json())
        .then((dataAtualizada) => setComunicacao(dataAtualizada));
  
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };
  
  return (
      <div className={styles.conteudoPagina}>
        <div className={styles.comunicacaoPagina}>
          <div className={styles.tituloComunicacao}>
              <h1 className={styles.andamento}><strong>Comunicação de Aluno</strong></h1>
          </div>

          {/* CONTEDUDO DA LOGO */}

          <div className={styles.divUserImagePerfil}>
            <Image src="/assets/images/logo.png" alt="Logo" width={80} height={80} />
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
                      <p className={styles.inputRespostaCheck}><i style={{ color: '#ff0000' }} className={`fa fa-check-square`}></i>{comunicacao.motivo} | {comunicacao.grauMotivo} Pts ({comunicacao.natureza})</p>
                      <p className={styles.labelEnquadramento}><i style={{ color: '#ff0000' }} className={`fa fa-info`}> -</i>{comunicacao.enquadramento}</p>
                    </div>
                  </li>
                  <li>
                    <i className={`fa fa-comment ${styles.navIcon}`}></i>
                    <p> <strong>{comunicacao.descricaoMotivo || 'Descricao do Motivo não informado'}</strong></p>
                  </li>
                  <li style={{ color: '#979494' }} >
                    <i className={`${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataCom ? new Date(comunicacao.dataCom).toLocaleString() : 'Nenhuma data informada'}
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
                  <li style={{ color: '#979494' }}>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataResp ? new Date(comunicacao.dataResp).toLocaleString() : 'Nenhuma data informada'}

                  </li>
                  {!comunicacao.resposta && (
                    <button className={styles.comunicacaoResp} onClick={() => setIsModalOpen(true)}>
                      Responder a Comunicação
                    </button>
                  )}

                </ul>
              </div>
              <br></br>
            {/* Bloco resposta do aluno */}

            {/* Bloco parecer do Cmt da Cia */}
              <h1 className={styles.inputRespostaH1}>III - Cmt da Cia</h1>
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
                  <li style={{ color: '#979494' }}>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataParecerCmtCia ? new Date(comunicacao.dataParecerCmtCia).toLocaleString() : 'Nenhuma data informada'}
                  </li>
                </ul>
              </div>
              <br></br>
            {/* Bloco parecer do Cmt da Cia */}

            {/* Bloco parecer do Cmt do CA */}
            <h1 className={styles.inputRespostaH1}>IV - Cmt do CA</h1>
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
                  <li style={{ color: '#979494' }}>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataParecerCa ? new Date(comunicacao.dataParecerCa).toLocaleString() : 'Nenhuma data informada'}
                  </li>
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
                  <li style={{ color: '#979494' }}>
                    <i className={` ${styles.navIcon}`}></i> 
                    <i className={`${styles.rightIcon}`}></i>
                    {comunicacao.dataParecerSubcom ? new Date(comunicacao.dataParecerSubcom).toLocaleString() : 'Nenhuma data informada'}
                  </li>
                </ul>
              </div>
              <br></br>
            {/* Bloco parecer do SubComando */}

            {/* Bloco status da comunuicacao */}
            
              <div>
                <ul>
                    <li>
                    <strong> Status Atual:</strong>
                      <i className={`${styles.rightIcon}`}></i>
                     <strong> {comunicacao.status} </strong>
                    </li>
                    <li>
                      <i className={` ${styles.navIconResposta}`}></i> 
                      <i className={`${styles.rightIcon}`}></i>
                      {comunicacao.dtAtualizacaoStatus ? new Date(comunicacao.dtAtualizacaoStatus).toLocaleString() : 'Nenhuma data informada'}
                    </li>
                </ul>
              </div>
              <br></br>
            {/* Bloco status da comunuicacao */}
          </div>
        </div>
          {/* Inicio Modal enviar comunicacao */}
              {isModalOpen && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h2>Responder à Comunicação</h2>
                    <textarea
                      placeholder="Digite sua justificativa aqui..."
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                      className={styles.inputRespostaTextarea}
                      rows={5}
                    />
                    <div className={styles.modalActions}>
                      <button onClick={handleSubmitResposta} className={styles.enviarRespBtn}>Enviar</button>
                      <button onClick={() => setIsModalOpen(false)} className={styles.cancelarBtn}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
          {/* Fim Modal enviar comunicacao */}
      </div>
    );
};


export default ComunicacaoRespPage;

