"use client";

import styles from "../../../privateLayout.module.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaThumbsUp } from "react-icons/fa";
import ModalResponder from "@/components/ModalResponder";
import ModalEnquadramento from "@/components/ModalEnquadramento";
import ModalParecerCmtCia from "@/components/ModalParecerCmtCia";
import ModalParecerCmtCa from "@/components/ModalParecerCmtCa";
import ModalParecerSubComando from "@/components/ModalParecerSubComando";
import ModalArquivamento from "@/components/ModalArquivamento";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

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

  dataCienciaResponsavel1: string | null;
  dataCienciaResponsavel2: string | null;

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
    seduc: string;
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
      grauInicial: number;
      grauAtual: number;
      turmaId: number;
      turma: {
        id: number;
        name: string;
        cia: {
          id: number;
          name: string;
        };
      };
      responsavel1: {
        pg: string;
        name: string;
        phone: string;
      };
      responsavel2: {
        pg: string;
        name: string;
        phone: string;
      };
    };
  };
  usercom?: {
    id: number;
    name: string;
    seduc: string;
    phone: string;
    cpf: string;
    orgao: string;
    pg: string;
    mat: number;
    nomeGuerra: string;
    funcao: string;
    typeUser: number;
  };
  usercmtcia?: {
    id: number;
    name: string;
    seduc: string;
    phone: string;
    cpf: string;
    orgao: string;
    pg: string;
    mat: number;
    nomeGuerra: string;
    funcao: string;
    typeUser: number;
  };
  userca?: {
    id: number;
    name: string;
    seduc: string;
    phone: string;
    cpf: string;
    orgao: string;
    pg: string;
    mat: number;
    nomeGuerra: string;
    funcao: string;
    typeUser: number;
  };
  usersubcom?: {
    id: number;
    name: string;
    seduc: string;
    phone: string;
    cpf: string;
    orgao: string;
    pg: string;
    mat: number;
    nomeGuerra: string;
    funcao: string;
    typeUser: number;
  };

  userarquivador?: {
    id: number;
    name: string;
    seduc: string;
    pg: string;
    nomeGuerra: string;
    funcao: string;
  };
}

interface UserLogin {
  id: number;
  name: string;
  seduc: string;
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
  const { id } = useParams();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [userLogin, setUserLogin] = useState<UserLogin | null>(null);
  const [comunicacao, setComunicacao] = useState<ComunicacaoResp | null>(null);

  const [isModalOpenResponder, setIsModalOpenResponder] = useState(false);
  const [resposta, setResposta] = useState("");

  const [isModalOpenEnquadramento, setIsModalOpenEnquadramento] =
    useState(false);
  const [grauMotivo, setgrauMotivo] = useState("");
  const [enquadramento, setenquadramento] = useState("");
  const [natureza, setnatureza] = useState("");

  const [isModalOpenParecerCia, setIsModalOpenParecerCia] = useState(false);
  const [parecerCmtCia, setparecerCmtCia] = useState("");

  const [isModalOpenParecerCa, setIsModalOpenParecerCa] = useState(false);
  const [parecerCa, setparecerCa] = useState("");

  const [isModalOpenParecerSubcom, setIsModalOpenParecerSubcom] =
    useState(false);
  const [parecerSubcom, setparecerSubcom] = useState("");

  const [isModalOpenArquivamento, setIsModalOpenArquivamento] = useState(false);
  const [motivoArquivamento, setmotivoArquivamento] = useState("");

  //Busca a cominicação apos o clique
  useEffect(() => {
    if (id) {
      const userLoginData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userData="))
        ?.split("=")[1];

      if (userLoginData) {
        try {
          const parsedUserLogin = JSON.parse(decodeURIComponent(userLoginData));
          setUserLogin(parsedUserLogin);
        } catch (error) {
          console.error("Erro ao parsear os dados do usuário:", error);
        }
      }

      // Busca via API route local
      fetch(`/api/comunicacao/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Dados da comunicação:", data);
          setComunicacao(data);
        })

        .catch((error) => {
          console.error("Erro ao carregar comunicação:", error);
        });
    }
  }, [id]);
  //Busca a cominicação apos o clique

  //INICIO FUNÇÃO ENQUADRAMENTO
  const handleSubmitEnquadramento = async () => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
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
      const response = await fetch(
        `/api/comunicacao/${comunicacao.id}/enquadramento`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grauMotivo: Number(grauMotivo),
            enquadramento: String(enquadramento),
            natureza: String(natureza),
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert("Erro 404: Comunicação não encontrada no backend.");
        } else {
          alert(`Erro ao enviar. Código: ${response.status}`);
        }
        return;
      }

      // Após PUT, refaz o GET para atualizar a comunicação completamente
      const getResponse = await fetch(`/api/comunicacao/${comunicacao.id}`);
      const updatedData = await getResponse.json();
      setComunicacao(updatedData);

      alert("Enquadramento enviado com sucesso!");
      setIsModalOpenEnquadramento(false);
      setgrauMotivo("");
      setnatureza("");
      setenquadramento("");
    } catch (error) {
      console.error("Erro ao enviar o Enquadramento:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };
  //FIM FUNÇÃO ENQUADRAMENTO

  //Inicio Resposta do aluno
  const handleSubmitResposta = async () => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }

    if (!userLogin) {
      alert("Usuário logado não identificado.");
      return;
    }

    if (!resposta.trim()) {
      alert("A resposta não pode estar vazia.");
      return;
    }

    try {
      const response = await fetch(
        `/api/comunicacao/${comunicacao.id}/responder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resposta }),
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert("Erro 404: Comunicação não encontrada.");
        } else {
          alert(`Erro ao enviar resposta. Código: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      alert("Resposta enviada com sucesso!");
      setIsModalOpenResponder(false);
      setResposta("");
      setComunicacao(data);

      // Atualiza os dados da comunicação
      fetch(`/api/comunicacao/${comunicacao.id}`)
        .then((res) => res.json())
        .then((dataAtualizada) => setComunicacao(dataAtualizada));
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };
  //Fim Resposta do aluno

  //INICIO Enviar ao Cmt da Cia
  const handleViewEnviarCmtCia = async (id: number) => {
    try {
      const response = await fetch(`/api/comunicacao/${id}/enviar-cmtcia`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert("Erro 404: Comunicação não encontrada no backend.");
        } else {
          alert(`Erro ao enviar. Código: ${response.status}`);
        }
        return;
      }

      // Refaz GET para atualizar os dados
      const getResponse = await fetch(`/api/comunicacao/${id}`);
      const updatedData = await getResponse.json();
      setComunicacao(updatedData);

      alert("Comunicação Enviada ao Cmt da Cia");
    } catch (error) {
      console.error("Erro ao enviar ao Cmt da Cia:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  //FIM FUNÇÃO enviat ao Cmt da cia

  //Inicio parecer cmt da cia
  const handleSubmitparecerCmtCia = async () => {
    if (!comunicacao) return alert("Comunicação não encontrada.");
    if (!userLogin) return alert("Usuário logado não identificado.");
    if (!parecerCmtCia.trim()) return alert("O Parecer não pode estar vazio.");

    try {
      const response = await fetch(
        `/api/comunicacao/${comunicacao.id}/parecer-cmtcia`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ parecerCmtCia, userIdCmtCia: userLogin.id }),
        },
      );

      if (!response.ok) {
        alert(`Erro ao enviar o Parecer. Código: ${response.status}`);
        return;
      }

      const data = await response.json();
      alert("Parecer enviado com sucesso!");
      setIsModalOpenParecerCia(false);
      setparecerCmtCia("");
      setComunicacao(data);
    } catch (error) {
      console.error("Erro ao enviar Parecer:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };
  //fim parecer cmt da cia

  const handleSubmitparecerCa = async () => {
    if (!comunicacao) return alert("Comunicação não encontrada.");
    if (!userLogin) return alert("Usuário logado não identificado.");
    if (!parecerCa.trim()) return alert("O Parecer não pode estar vazio.");

    try {
      const response = await fetch(
        `/api/comunicacao/${comunicacao.id}/parecer-cmtca`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ parecerCa, userIdCa: userLogin.id }),
        },
      );

      if (!response.ok) {
        alert(`Erro ao enviar parecer do CA. Código: ${response.status}`);
        return;
      }

      const data = await response.json();
      alert("Parecer do CA enviado com sucesso!");
      setIsModalOpenParecerCa(false);
      setparecerCa("");
      setComunicacao(data);
    } catch (error) {
      console.error("Erro ao enviar parecer do CA:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  //Inicio parecer subcomando
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
      const response = await fetch(
        `/api/comunicacao/${comunicacao.id}/parecer-subcomando`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parecerSubcom,
            userIdSubcom: userLogin.id,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao enviar parecer do Subcom: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      alert("Parecer do Subcom enviado com sucesso!");
      setIsModalOpenParecerSubcom(false);
      setparecerSubcom("");
      setComunicacao(data);
    } catch (error) {
      console.error("Erro ao enviar parecer do Subcom:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };
  //Inicio parecer subcomando

  // inicio função publicação
  const handleViewPublicarComunicacao = async (id: number) => {
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }

    const confirmarPublicacao = window.confirm(
      "Deseja realmente publicar essa comunicação?",
    );
    if (!confirmarPublicacao) {
      return;
    }

    try {
      const response = await fetch(`/api/comunicacao/${id}/publicacao`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao publicar: ${errorData.error}`);
        return;
      }

      const data = await response.json();

      alert("Comunicação publicada com sucesso!");

      setComunicacao({
        ...comunicacao,
        status: data.status,
        dtAtualizacaoStatus: data.dtAtualizacaoStatus,
      });
    } catch (error) {
      console.error("Erro ao publicar:", error);
      alert("Erro ao atualizar status da comunicação.");
    }
  };
  // inicio função publicação

  //Inicio função Arquivamenteo
  const handleViewArquivarComunicacao = async (id: number) => {
    if (!motivoArquivamento.trim()) {
      alert("Informe o motivo do arquivamento");
      return;
    }
    if (!comunicacao) {
      alert("Comunicação não encontrada.");
      return;
    }

    const confirmarArquivamento = window.confirm(
      "Deseja arquivar essa comunicação?",
    );
    if (!confirmarArquivamento) {
      return;
    }

    if (!userLogin) {
      alert("Usuário não está logado");
      return;
    }

    try {
      const response = await fetch(`/api/comunicacao/${id}/arquivamento`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdArquivamento: userLogin.id,
          motivoArquivamento: String(motivoArquivamento),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao arquivar: ${errorData.error}`);
        return;
      }

      const updatedData = await response.json();
      setComunicacao(updatedData);

      alert("Arquivamento realizado com sucesso!");
      setIsModalOpenArquivamento(false);
      setmotivoArquivamento("");
    } catch (error) {
      console.error("Erro ao tentar arquivar a comunicação:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  function podeArquivarStatus(status: string): boolean {
    const statusPermitidos = [
      "Aguardando notificar aluno",
      "Aguardando resposta do aluno",
      "Aguardando enviar ao Cmt da Cia",
      "Aguardando parecer do Cmt da Cia",
      "Aguardando parecer do Cmt do CA",
      "Aguardando parecer do Subcomando",
      "Aguardando publicação",
      "Comunicação publicada",
    ];
    return statusPermitidos.includes(status);
  }
  //fim função Arquivamenteo

  const handleExcluirComunicacao = async () => {
    if (!id) return;

    const confirmacao = confirm(
      "Tem certeza que deseja excluir esta comunicação?",
    );
    if (!confirmacao) return;

    try {
      const response = await fetch(`/api/comunicacao/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const erro = await response.json();
        console.error("Erro ao excluir:", erro);
        alert("Erro ao excluir a comunicação.");
        return;
      }

      alert("Comunicação excluída com sucesso.");
      window.location.href = "/comunicacao";
    } catch (error) {
      console.error("Erro na exclusão:", error);
      alert("Erro inesperado ao excluir.");
    }
  };

  const gerarPdf = () => {
    if (!pdfRef.current) {
      console.error("PDF ref não encontrada");
      return;
    }
    const element = pdfRef.current;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `comunicacao_${comunicacao?.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    } as const;

    html2pdf().set(opt).from(element).save();
  };

  if (!comunicacao) return <div>Carregando...</div>;
  return (
    <div style={{ maxHeight: "900px", overflowY: "auto" }}>
      {/* inicio menu tramitação */}
      {userLogin?.typeUser != null && [10, 5].includes(userLogin.typeUser) && (
        <div className={styles.menuBotoesComunicacaoVer}>
          {/* inicio gerar pdf */}
          <button className={styles.botoesComunicacaoVer} onClick={gerarPdf}>
            <i
              className={`fa fa-file-pdf ${styles.menuIconsComunicacaoVer}`}
              title="Gerar Pdf"
              style={{ color: "#ff3300" }}
            ></i>
          </button>

          {/* fim gerar pdf */}

          {/* inicio enquadramento e notificar aluno */}
          <button
            className={styles.botoesComunicacaoVer}
            onClick={() =>
              comunicacao.status === "Aguardando notificar aluno"
                ? setIsModalOpenEnquadramento(true)
                : null
            }
            style={{
              cursor:
                comunicacao.status === "Aguardando notificar aluno"
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={comunicacao.status !== "Aguardando notificar aluno"}
          >
            <i
              className={`fa fa-pencil ${styles.menuIconsComunicacaoVer}`}
              title={
                comunicacao.status === "Aguardando notificar aluno"
                  ? "Notificar Aluno"
                  : "Aluno já notificado"
              }
              style={{
                color:
                  comunicacao.status === "Aguardando notificar aluno"
                    ? "#d21e18"
                    : "#b3aeae",
              }}
            ></i>
          </button>
          {/* fim enquadramento e notificar aluno */}

          {/* início resposta do aluno ou aguardando enviar ao Cmt da Cia */}
          <button
            className={styles.botoesComunicacaoVer}
            onClick={() =>
              comunicacao &&
              (comunicacao.status === "Aguardando resposta do aluno" ||
                comunicacao.status === "Aguardando enviar ao Cmt da Cia")
                ? handleViewEnviarCmtCia(comunicacao.id)
                : null
            }
            style={{
              cursor:
                comunicacao.status === "Aguardando resposta do aluno" ||
                comunicacao.status === "Aguardando enviar ao Cmt da Cia"
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={
              comunicacao.status !== "Aguardando resposta do aluno" &&
              comunicacao.status !== "Aguardando enviar ao Cmt da Cia"
            }
          >
            <i
              className={`fa fa-mortar-board ${styles.menuIconsComunicacaoVer}`}
              title={
                comunicacao.status === "Aguardando resposta do aluno" ||
                comunicacao.status === "Aguardando enviar ao Cmt da Cia"
                  ? "Enviar ao Cmt da Cia"
                  : "Ação indisponível"
              }
              style={{
                color:
                  comunicacao.status === "Aguardando resposta do aluno" ||
                  comunicacao.status === "Aguardando enviar ao Cmt da Cia"
                    ? "#27d317"
                    : "#b3aeae",
              }}
            ></i>
          </button>
          {/* fim resposta do aluno ou aguardando enviar ao Cmt da Cia */}

          {/* inicio Aguardando parecer do Cmt da Cia */}
          <button
            className={styles.botoesComunicacaoVer}
            style={{
              cursor:
                comunicacao.status === "Aguardando parecer do Cmt da Cia"
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={comunicacao.status !== "Aguardando parecer do Cmt da Cia"}
          >
            <i
              className={`fa fa-cube ${styles.menuIconsComunicacaoVer}`}
              title={
                comunicacao.status === "Aguardando parecer do Cmt da Cia"
                  ? "Aguardando parecer do Cmt da Cia"
                  : "Ação indisponível"
              }
              style={{
                color:
                  comunicacao.status === "Aguardando parecer do Cmt da Cia"
                    ? "#820e8d"
                    : "#b3aeae",
              }}
            ></i>
          </button>
          {/* inicio Aguardando parecer do Cmt da Cia */}

          {/* inicio Aguardando parecer do Cmt da CA */}
          <button
            className={styles.botoesComunicacaoVer}
            style={{
              cursor:
                comunicacao.status === "Aguardando parecer do Cmt do CA"
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={comunicacao.status !== "Aguardando parecer do Cmt do CA"}
          >
            <i
              className={`fa fa-cubes ${styles.menuIconsComunicacaoVer}`}
              title={
                comunicacao.status === "Aguardando parecer do Cmt do CA"
                  ? "Aguardando parecer do Cmt do CA"
                  : "Ação indisponível"
              }
              style={{
                color:
                  comunicacao.status === "Aguardando parecer do Cmt do CA"
                    ? "#cc8220"
                    : "#b3aeae",
              }}
            ></i>
          </button>
          {/* inicio Aguardando parecer do Cmt da CA */}

          {/* inicio Aguardando parecer do SubComando */}
          <button
            className={styles.botoesComunicacaoVer}
            style={{
              cursor:
                comunicacao.status === "Aguardando parecer do Subcomando"
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={comunicacao.status !== "Aguardando parecer do Subcomando"}
          >
            <i
              className={`fa fa-star ${styles.menuIconsComunicacaoVer}`}
              title={
                comunicacao.status === "Aguardando parecer do Subcomando"
                  ? "Aguardando parecer do Subcomando"
                  : "Ação indisponível"
              }
              style={{
                color:
                  comunicacao.status === "Aguardando parecer do Subcomando"
                    ? "#ffee01"
                    : "#b3aeae",
              }}
            ></i>
          </button>
          {/* inicio Aguardando parecer do Subcomando */}

          {/* inicio publicar comunicação */}
          <button
            className={styles.botoesComunicacaoVer}
            onClick={() => handleViewPublicarComunicacao(comunicacao.id)}
            style={{
              cursor:
                comunicacao.status === "Aguardando publicação"
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={comunicacao.status !== "Aguardando publicação"}
          >
            <i
              className={`fa fa-folder ${styles.menuIconsComunicacaoVer}`}
              title={
                comunicacao.status === "Aguardando publicação"
                  ? "Publicar Comunicação"
                  : "Ação indisponivel"
              }
              style={{
                color:
                  comunicacao.status === "Aguardando publicação"
                    ? "#000000"
                    : "#b3aeae",
              }}
            ></i>
          </button>
          {/* fim publicar comunicação */}

          {/* início Arquivar comunicação */}
          <button
            className={styles.botoesComunicacaoVer}
            onClick={() => {
              if (podeArquivarStatus(comunicacao.status)) {
                setIsModalOpenArquivamento(true);
              }
            }}
            style={{
              cursor: podeArquivarStatus(comunicacao.status)
                ? "pointer"
                : "not-allowed",
            }}
            disabled={!podeArquivarStatus(comunicacao.status)}
          >
            <i
              className={`fa fa-archive ${styles.menuIconsComunicacaoVer}`}
              title={
                podeArquivarStatus(comunicacao.status)
                  ? "Arquivar Comunicação"
                  : "Ação indisponível"
              }
              style={{
                color: podeArquivarStatus(comunicacao.status)
                  ? "#27d317"
                  : "#b3aeae",
              }}
            ></i>
          </button>
          {/* fim Arquivar comunicação */}

          {/* inicio botao excluir comunicação */}
          {userLogin &&
            comunicacao &&
            (userLogin.id === comunicacao.userIdCom ||
              userLogin.typeUser === 10) && (
              <button
                className={styles.botoesComunicacaoVer}
                onClick={handleExcluirComunicacao}
              >
                <i
                  className={`fa fa-trash ${styles.menuIconsComunicacaoVer}`}
                ></i>
              </button>
            )}

          {/* fim botao excluir comunicação */}
        </div>
      )}
      {/* fim menu tramitação */}
      <div
        ref={pdfRef}
        style={{ padding: "5px", backgroundColor: "#ffffff78" }}
      >
        {/* inicio cabeçalho */}
        <div className={styles.divUserImagePerfil}>
          <Image
            src="/assets/images/govpesei.png"
            alt="Logo"
            width={120}
            height={120}
          />
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: "#000000" }}
          >
            Colegio da Policia Militar - CPM
          </div>
          <div
            style={{ fontSize: "16px", fontWeight: "bold", color: "#000000" }}
          >
            Corpo de Alunos
          </div>
        </div>
        {/* fim cabeçalho */}

        {/* Bloco identificação do aluno */}
        <div
          style={{
            fontSize: "14px",
            color: "#333",
            paddingLeft: "10px",
            fontWeight: "bold",
          }}
        >
          Comunicação nº:0{comunicacao.id}
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#333",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        >
          <div style={{ paddingLeft: "20px" }}>
            <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
            {comunicacao.useral?.name}
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <i className={`fa fa-cube ${styles.navIcon}`}></i> Turma:
            <strong>
              {comunicacao.useral?.aluno?.turma.name} |{" "}
              {comunicacao.useral?.aluno?.turma.cia.name}
            </strong>
          </div>
        </div>
        {/* Bloco identificação do aluno */}

        <div className={styles.profileDetails}>
          {/* Bloco Comunicante */}
          <h1 className={styles.inputRespostaH1}>I - Comunicação</h1>
          <div className={styles.comunicacaoPagina}>
            <ul>
              <div
                className={styles.divIdentificacaoUsuario}
                style={{
                  fontWeight: "bold",
                }}
              >
                <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                {comunicacao.usercom?.pg} {comunicacao.usercom?.nomeGuerra} |{" "}
                {comunicacao.usercom?.funcao}
                <i className={`${styles.rightIcon}`}></i>
                {comunicacao.dataCom
                  ? new Date(comunicacao.dataCom).toLocaleString()
                  : "Nenhuma data informada"}
              </div>
              <div className={styles.divConteudoComunicacao}>
                <div className={styles.enquadramento}>
                  <div>
                    <div>
                      <span>
                        <strong>Motivo: </strong>
                      </span>
                      <span> {comunicacao.motivo}</span>
                    </div>
                    <div>
                      <strong>Natureza: </strong>
                      <span>
                        {comunicacao.natureza} ({comunicacao.grauMotivo})
                      </span>
                    </div>
                    <div>
                      <strong>Infor do enquadramento: </strong>
                      <span>{comunicacao.enquadramento}</span>
                    </div>

                    <div style={{ paddingTop: "10px" }}>
                      <strong>Descrição do fato: </strong> <br></br>
                      <span className={styles.pRespostaAluno}>
                        {comunicacao.descricaoMotivo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ul>
          </div>
          <br></br>
          {/* Bloco Comunicante */}

          {/* Bloco resposta do aluno */}
          <h1 className={styles.inputRespostaH1}>II - Resposta</h1>
          <div className={styles.comunicacaoPagina}>
            <div>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                <strong>
                  {comunicacao.useral?.pg} {comunicacao.useral?.nomeGuerra} |{" "}
                  {comunicacao.useral?.funcao}
                </strong>
                <i className={`${styles.rightIcon}`}></i>
                {comunicacao.dataResp
                  ? new Date(comunicacao.dataResp).toLocaleString()
                  : "Nenhuma data informada"}
              </li>
              <div className={styles.divConteudoComunicacao}>
                <div className={styles.enquadramento}>
                  <div>
                    <div>
                      <span>
                        <strong>Resposta: </strong>
                      </span>
                      <span>
                        {" "}
                        {comunicacao.resposta ? (
                          <p className={styles.pRespostaAluno}>
                            {comunicacao.resposta}
                          </p>
                        ) : (
                          <span style={{ color: "#979494" }}>
                            Aguardando resposta do Aluno
                          </span>
                        )}
                      </span>

                      {/* Inicio Responsalvel 1 */}
                      <div className={styles.divCienciaResponsavel}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                          <span style={{ paddingRight: "10px" }}>
                            {comunicacao.useral?.aluno?.responsavel1?.name}
                          </span>
                          <FaThumbsUp
                            fontSize={12}
                            color={
                              comunicacao.dataCienciaResponsavel1
                                ? "green"
                                : "gray"
                            }
                            title={
                              comunicacao.dataCienciaResponsavel1
                                ? `Visualizado em: ${new Date(
                                    comunicacao.dataCienciaResponsavel1,
                                  ).toLocaleString("pt-BR")}`
                                : "Ainda não visualizado"
                            }
                          />
                        </div>
                      </div>
                      {/* Fim Responsalvel 1 */}

                      {/* Inicio Responsalvel 2 */}
                      <div className={styles.divCienciaResponsavel}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                          <span style={{ paddingRight: "10px" }}>
                            {comunicacao.useral?.aluno?.responsavel2?.name}
                          </span>
                          <FaThumbsUp
                            fontSize={12}
                            color={
                              comunicacao.dataCienciaResponsavel2
                                ? "green"
                                : "gray"
                            }
                            title={
                              comunicacao.dataCienciaResponsavel2
                                ? `Visualizado em: ${new Date(
                                    comunicacao.dataCienciaResponsavel2,
                                  ).toLocaleString("pt-BR")}`
                                : "Ainda não visualizado"
                            }
                          />
                        </div>
                      </div>
                      {/* Fim Responsalvel 2 */}
                    </div>
                  </div>
                </div>
              </div>

              {comunicacao.status === "Aguardando resposta do aluno" &&
                userLogin?.id === comunicacao.useral?.id && (
                  <button
                    className={styles.comunicacaoResp}
                    onClick={() => setIsModalOpenResponder(true)}
                  >
                    Responder à Comunicação
                  </button>
                )}
            </div>
          </div>
          <br></br>
          {/* Bloco resposta do aluno */}

          {/* Bloco parecer do cmt da cia */}
          <h1 className={styles.inputRespostaH1}>
            III - Parecer do Comandante da Companhia
          </h1>
          <div className={styles.comunicacaoPagina}>
            <div>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                <strong>
                  {comunicacao.usercmtcia?.pg}{" "}
                  {comunicacao.usercmtcia?.nomeGuerra} |{" "}
                  {comunicacao.usercmtcia?.funcao}
                </strong>
                <i className={`${styles.rightIcon}`}></i>
                {comunicacao.dataParecerCmtCia
                  ? new Date(comunicacao.dataParecerCmtCia).toLocaleString()
                  : "Nenhuma data informada"}
              </li>
              <div className={styles.divConteudoComunicacao}>
                <div className={styles.enquadramento}>
                  <div>
                    <div>
                      <span>
                        <strong>Parecer: </strong>
                      </span>
                      <span>
                        {" "}
                        {comunicacao.parecerCmtCia ? (
                          <p className={styles.pRespostaAluno}>
                            {comunicacao.parecerCmtCia}
                          </p>
                        ) : (
                          <span style={{ color: "#979494" }}>
                            Aguardando parecer do Comandante da Companhia
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifica se o typeUser é de um Cmt da Cia */}
              {comunicacao.status === "Aguardando parecer do Cmt da Cia" &&
                userLogin?.typeUser === 6 && (
                  <button
                    className={styles.comunicacaoResp}
                    onClick={() => setIsModalOpenParecerCia(true)}
                  >
                    Parecer do Cmt da Cia
                  </button>
                )}
            </div>
          </div>
          <br></br>
          {/* Bloco parecer do cmt da cia */}

          {/* Bloco parecer do cmt da CA */}
          <h1 className={styles.inputRespostaH1}>
            IV - Parecer do Comandante do Corpo de Alunos
          </h1>
          <div className={styles.comunicacaoPagina}>
            <div>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                <strong>
                  {comunicacao.userca?.pg} {comunicacao.userca?.nomeGuerra} |{" "}
                  {comunicacao.userca?.funcao}
                </strong>
                <i className={`${styles.rightIcon}`}></i>
                {comunicacao.dataParecerCa
                  ? new Date(comunicacao.dataParecerCa).toLocaleString()
                  : "Nenhuma data informada"}
              </li>
              <div className={styles.divConteudoComunicacao}>
                <div className={styles.enquadramento}>
                  <div>
                    <div>
                      <span>
                        <strong>Parecer: </strong>
                      </span>
                      <span>
                        {" "}
                        {comunicacao.parecerCa ? (
                          <p className={styles.pRespostaAluno}>
                            {comunicacao.parecerCa}
                          </p>
                        ) : (
                          <span style={{ color: "#979494" }}>
                            Aguardando parecer do Comandante do Corpo de Alunos
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifica se o typeUser é de um Cmt da Cia */}
              {comunicacao.status === "Aguardando parecer do Cmt do CA" &&
                userLogin?.typeUser === 7 && (
                  <button
                    className={styles.comunicacaoResp}
                    onClick={() => setIsModalOpenParecerCa(true)}
                  >
                    Parecer do Comandante do Corpo de Alunos
                  </button>
                )}
            </div>
          </div>
          <br></br>
          {/* Bloco parecer do cmt da CA */}

          {/* Bloco parecer do SubComando */}
          <h1 className={styles.inputRespostaH1}>IV - Parecer do SubComando</h1>
          <div className={styles.comunicacaoPagina}>
            <div>
              <li>
                <i className={`fa fa-user ${styles.navIcon}`}></i>{" "}
                <strong>
                  {comunicacao.usersubcom?.pg}{" "}
                  {comunicacao.usersubcom?.nomeGuerra} |{" "}
                  {comunicacao.usersubcom?.funcao}
                </strong>
                <i className={`${styles.rightIcon}`}></i>
                {comunicacao.dataParecerSubcom
                  ? new Date(comunicacao.dataParecerSubcom).toLocaleString()
                  : "Nenhuma data informada"}
              </li>
              <div className={styles.divConteudoComunicacao}>
                <div className={styles.enquadramento}>
                  <div>
                    <div>
                      <span>
                        <strong>Parecer: </strong>
                      </span>
                      <span>
                        {" "}
                        {comunicacao.parecerSubcom ? (
                          <p className={styles.pRespostaAluno}>
                            {comunicacao.parecerSubcom}
                          </p>
                        ) : (
                          <span style={{ color: "#979494" }}>
                            Aguardando parecer do do SubComando
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifica se o typeUser é de um Cmt da Cia */}
              {comunicacao.status === "Aguardando parecer do Subcomando" &&
                userLogin?.typeUser === 8 && (
                  <button
                    className={styles.comunicacaoResp}
                    onClick={() => setIsModalOpenParecerSubcom(true)}
                  >
                    Parecer do Comandante do SubComando
                  </button>
                )}
            </div>
          </div>
          <br></br>
          {/* Bloco parecer do SubComando */}

          {/* inicio rodape */}
          <div className={styles.divComunicacaoRodape}>
            <div style={{ display: "block" }}>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  ALDO JOSÉ BEZERRA DE OLIVEIRA - TEN CEL QOPM <br></br>
                  Comandante do Colegio da Policia Militar - CPM
                </p>
              </div>
            </div>
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={60}
              height={60}
            />
          </div>
          {/* fim rodape */}

          {/* Blococomunicação arquivada */}
          <div style={{ marginBottom: "100px" }}>
            <div>
              {comunicacao.status === "Comunicação arquivada" && (
                <li
                  style={{
                    display: "flex",
                    textAlign: "right",
                    gap: "5px",
                    flexWrap: "wrap", // permite quebra de linha quando necessário
                  }}
                >
                  <span>
                    Comunicação arquivada por{" "}
                    <span style={{ whiteSpace: "nowrap" }}>
                      <strong>{comunicacao.userarquivador?.seduc}</strong>
                    </span>{" "}
                    em{" "}
                    <span style={{ whiteSpace: "nowrap" }}>
                      <strong>
                        {comunicacao.dtAtualizacaoStatus
                          ? new Date(
                              comunicacao.dtAtualizacaoStatus,
                            ).toLocaleString()
                          : "Nenhuma data informada"}
                      </strong>
                    </span>
                  </span>
                </li>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Image
                  src="/assets/images/qrcodecomunicacao.png"
                  alt="Logo"
                  width={50}
                  height={50}
                />
                <p
                  style={{
                    marginLeft: "5px",
                    fontSize: "12px",
                    color: "#8d8d96",
                  }}
                >
                  A autenticidade desse documento pode ser conferida no site
                  www.atos_cpm.pm.pe.gov.br
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  textAlign: "right",
                }}
              >
                <p
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "12px",
                    background: "#de0505",
                    color: "#ffffff",
                  }}
                >
                  Situação da Comunicação: {comunicacao.status}
                </p>
              </div>
            </div>
          </div>
          {/* Blococomunicação arquivada */}
        </div>
      </div>

      {isModalOpenResponder && (
        <ModalResponder
          resposta={resposta}
          setResposta={setResposta}
          onClose={() => setIsModalOpenResponder(false)}
          onSubmit={handleSubmitResposta}
        />
      )}

      {isModalOpenEnquadramento && (
        <ModalEnquadramento
          grauMotivo={grauMotivo}
          setgrauMotivo={setgrauMotivo}
          natureza={natureza}
          setnatureza={setnatureza}
          enquadramento={enquadramento}
          setenquadramento={setenquadramento}
          onClose={() => setIsModalOpenEnquadramento(false)}
          onSubmit={handleSubmitEnquadramento}
        />
      )}

      {isModalOpenParecerCia && (
        <ModalParecerCmtCia
          isOpen={isModalOpenParecerCia}
          parecer={parecerCmtCia}
          onChange={setparecerCmtCia}
          onSubmit={handleSubmitparecerCmtCia}
          onClose={() => setIsModalOpenParecerCia(false)}
        />
      )}

      {isModalOpenParecerCa && (
        <ModalParecerCmtCa
          isOpen={isModalOpenParecerCa}
          parecer={parecerCa}
          onChange={setparecerCa}
          onSubmit={handleSubmitparecerCa}
          onClose={() => setIsModalOpenParecerCa(false)}
        />
      )}

      {isModalOpenParecerSubcom && (
        <ModalParecerSubComando
          isOpen={isModalOpenParecerSubcom}
          parecer={parecerSubcom}
          onChange={setparecerSubcom}
          onSubmit={handleSubmitparecerSubcom}
          onClose={() => setIsModalOpenParecerSubcom(false)}
        />
      )}

      {isModalOpenArquivamento && (
        <ModalArquivamento
          isOpen={isModalOpenArquivamento}
          motivo={motivoArquivamento}
          onChange={setmotivoArquivamento}
          onSubmit={() => handleViewArquivarComunicacao(comunicacao.id)}
          onClose={() => setIsModalOpenArquivamento(false)}
        />
      )}
    </div>
  );
};

export default ComunicacaoRespPage;
