"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from ".././privateLayout.module.css";
import {
  FaCube,
  FaCubes,
  FaGraduationCap,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { FaFolderClosed, FaPencil } from "react-icons/fa6";

interface Comunicacao {
  id: number;
  motivo: string;
  descricaoMotivo: string;
  natureza: string;
  grauMotivo: string;
  enquadramento: string | null;
  dataInicio: string;
  horaInicio: string;
  dataCom: string;
  resposta: string | null;
  dataResp: string | null;
  parecerCmtCia: string | null;
  dataParecerCmtCia: string | null;
  parecerCa: string | null;
  dataParecerCa: string | null;
  parecerSubcom: string | null;
  dataParecerSubcom: string | null;
  status: string;
  dtAtualizacaoStatus: string | null;
  useral?: {
    pg: string;
    nomeGuerra: string;
    funcao: string;
    aluno?: {
      turma: {
        name: string;
        cia: {
          name: string;
        };
      };
    };
  };
  usercom?: {
    id: number;
    pg: string;
    nomeGuerra: string;
    funcao: string;
  };
  usercmtcia?: {
    id: number;
    pg: string;
    nomeGuerra: string;
    funcao: string;
  };
  userca?: {
    id: number;
    pg: string;
    nomeGuerra: string;
    funcao: string;
  };
  usersubcom?: {
    id: number;
    pg: string;
    nomeGuerra: string;
    funcao: string;
  };
}

interface ContagemStatusCia {
  ciaName: string;
  status: string;
  total: number;
}

interface ContagemCia {
  ciaName: string;
  total: number;
}

const ComunicacaosPage = () => {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const [contagem, setContagem] = useState<ContagemStatusCia[]>([]);
  const [contagemCia, setContagemCia] = useState<ContagemCia[]>([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resComunicacoes, resContagemStatus, resContagemCia] =
          await Promise.all([
            fetch("/api/comunicacao"),
            fetch("/api/comunicacao/contar-status-cia"),
            fetch("/api/comunicacao/contar-cia"),
          ]);

        if (
          !resComunicacoes.ok ||
          !resContagemStatus.ok ||
          !resContagemCia.ok
        ) {
          throw new Error("Erro ao buscar dados");
        }

        const dataComunicacoes: Comunicacao[] = await resComunicacoes.json();
        const dataContagemStatus: ContagemStatusCia[] =
          await resContagemStatus.json();
        const dataContagemCia: ContagemCia[] = await resContagemCia.json();

        setComunicacoes(dataComunicacoes);
        setContagem(dataContagemStatus);
        setContagemCia(dataContagemCia);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const handleView = (id: number) => {
    router.push(`/comunicacao/${id}/tramitacao`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Aguardando notificar aluno":
        return "red";
      case "Aguardando resposta do aluno":
        return "green";
      case "Aguardando parecer do Cmt da Cia":
        return "purple";
      case "Aguardando parecer do Cmt do CA":
        return "orange";
      case "Aguardando parecer do Subcomando":
        return "yellow";
      case "Comunicação publicada":
        return "black";
      case "Comunicação arquivada":
        return "black";
      default:
        return "#0a4d6b"; // Cor padrão
    }
  };

  const getTotalPorCia = (cia: string): number => {
    const item = contagemCia.find((c) => c.ciaName === cia);
    return item ? item.total : 0;
  };

  const getTotalPorCiaEStatus = (cia: string, status: string): number => {
    const item = contagem.find((c) => c.ciaName === cia && c.status === status);
    return item ? item.total : 0;
  };

  if (loading) return <p>Carregando comunicações...</p>;
  if (erro) return <p style={{ color: "red" }}>Erro: {erro}</p>;

  return (
    <div style={{ background: "#ffffff91" }}>
      <h1 className={styles.tituloListar}>Comunicações</h1>

      {comunicacoes.length === 0 ? (
        <p>Nenhuma comunicação encontrada.</p>
      ) : (
        <div className={styles.containerPrincipal}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              background: "#ffffff91",
              paddingBottom: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div className={styles.topoContainer}>
              {/* Menu da 1ª cia */}
              <div className={styles.ciaBox}>
                <div style={{ display: "flex", flex: "1" }}>
                  <div className={styles.divBotoesCia}>1ª CIA</div>
                  <div style={{ background: "#1a7bbc", width: "70%" }}>
                    <div className={styles.divTotal}>
                      {getTotalPorCia("1ª CIA")}
                    </div>
                    <div className={styles.divTextoTotais}>Comunicações</div>
                  </div>
                </div>
                <div className={styles.divBotoesPrincipal}>
                  {/* primeira coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaPencil fontSize={20} color="#cf1121" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "1ª CIA",
                            "Aguardando notificar aluno",
                          )}
                        </div>

                        <div style={{ fontSize: "11px" }}>COMUNICANTE</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaGraduationCap fontSize={20} color="#1aa615" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "1ª CIA",
                            "Aguardando resposta do aluno",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>ALUNO</div>
                      </div>
                    </div>
                  </div>
                  {/* primeira coluna */}

                  {/* segunda coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaCube fontSize={20} color="#9e0ca3" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "1ª CIA",
                            "Aguardando parecer do Cmt da Cia",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>CMT CIA</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaCubes fontSize={20} color="#e1860e" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "1ª CIA",
                            "Aguardando parecer do Cmt do CA",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>CMT CA</div>
                      </div>
                    </div>
                  </div>
                  {/* segunda coluna */}

                  {/* terceria coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaStar fontSize={20} color="#ead80f" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "1ª CIA",
                            "Aguardando parecer do Subcomando",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>SUBCOMANDO</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaFolderClosed fontSize={20} color="#2d312d" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "1ª CIA",
                            "Aguardando arquivada",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>ARQUIVADAS</div>
                      </div>
                    </div>
                  </div>
                  {/* terceria coluna */}
                </div>
              </div>
              {/* Menu da 1ª cia */}

              {/* Menu da 2ª cia */}
              <div className={styles.ciaBox}>
                <div style={{ display: "flex", flex: "1" }}>
                  <div className={styles.divBotoesCia}>2ª CIA</div>
                  <div style={{ background: "#1a7bbc", width: "70%" }}>
                    <div className={styles.divTotal}>
                      {getTotalPorCia("2ª CIA")}
                    </div>
                    <div className={styles.divTextoTotais}>Comunicações</div>
                  </div>
                </div>
                <div className={styles.divBotoesPrincipal}>
                  {/* primeira coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaPencil fontSize={20} color="#cf1121" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "2ª CIA",
                            "Aguardando notificar aluno",
                          )}
                        </div>

                        <div style={{ fontSize: "11px" }}>COMUNICANTE</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaGraduationCap fontSize={20} color="#1aa615" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "2ª CIA",
                            "Aguardando resposta do aluno",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>ALUNO</div>
                      </div>
                    </div>
                  </div>
                  {/* primeira coluna */}

                  {/* segunda coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaCube fontSize={20} color="#9e0ca3" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "2ª CIA",
                            "Aguardando parecer do Cmt da Cia",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>CMT CIA</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaCubes fontSize={20} color="#e1860e" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "2ª CIA",
                            "Aguardando parecer do Cmt do CA",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>CMT CA</div>
                      </div>
                    </div>
                  </div>
                  {/* segunda coluna */}

                  {/* terceria coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaStar fontSize={20} color="#ead80f" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "2ª CIA",
                            "Aguardando parecer do Subcomando",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>SUBCOMANDO</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaFolderClosed fontSize={20} color="#2d312d" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "2ª CIA",
                            "Aguardando arquivada",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>ARQUIVADAS</div>
                      </div>
                    </div>
                  </div>
                  {/* terceria coluna */}
                </div>
              </div>
              {/* Menu da 2ª cia */}

              {/* Menu da 3ª cia */}
              <div className={styles.ciaBox}>
                <div style={{ display: "flex", flex: "1" }}>
                  <div className={styles.divBotoesCia}>3ª CIA</div>
                  <div style={{ background: "#1a7bbc", width: "70%" }}>
                    <div className={styles.divTotal}>
                      {getTotalPorCia("3ª CIA")}
                    </div>
                    <div className={styles.divTextoTotais}>Comunicações</div>
                  </div>
                </div>
                <div className={styles.divBotoesPrincipal}>
                  {/* primeira coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaPencil fontSize={20} color="#cf1121" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "3ª CIA",
                            "Aguardando notificar aluno",
                          )}
                        </div>

                        <div style={{ fontSize: "11px" }}>COMUNICANTE</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaGraduationCap fontSize={20} color="#1aa615" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "3ª CIA",
                            "Aguardando resposta do aluno",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>ALUNO</div>
                      </div>
                    </div>
                  </div>
                  {/* primeira coluna */}

                  {/* segunda coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaCube fontSize={20} color="#9e0ca3" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "3ª CIA",
                            "Aguardando parecer do Cmt da Cia",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>CMT CIA</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaCubes fontSize={20} color="#e1860e" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "3ª CIA",
                            "Aguardando parecer do Cmt do CA",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>CMT CA</div>
                      </div>
                    </div>
                  </div>
                  {/* segunda coluna */}

                  {/* terceria coluna */}
                  <div style={{ flex: "1" }}>
                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaStar fontSize={20} color="#ead80f" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "3ª CIA",
                            "Aguardando parecer do Subcomando",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>SUBCOMANDO</div>
                      </div>
                    </div>

                    <div className={styles.divBotoesSuperiores}>
                      <div className={styles.divIcone}>
                        <FaFolderClosed fontSize={20} color="#2d312d" />
                      </div>

                      <div style={{ marginLeft: "10px", width: "50%" }}>
                        <div style={{ fontSize: "12px" }}>
                          {getTotalPorCiaEStatus(
                            "3ª CIA",
                            "Aguardando arquivada",
                          )}
                        </div>
                        <div style={{ fontSize: "11px" }}>ARQUIVADAS</div>
                      </div>
                    </div>
                  </div>
                  {/* terceria coluna */}
                </div>
              </div>
              {/* Menu da 3ª cia */}
            </div>

            <h1
              style={{
                marginTop: "50px",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              COMUNICAÇÃO DE ALUNO
            </h1>
          </div>

          <div className={styles.scrollableTableWrapper}>
            <table className={styles.tabelaComunicacao}>
              <tbody>
                {comunicacoes.map((comunicacao) => (
                  <React.Fragment key={comunicacao.id}>
                    {/* Linha de título */}

                    {/* Linha com os dados da comunicação */}
                    <tr
                      style={{ borderBottom: "2px solid #000000" }}
                      onClick={() => handleView(comunicacao.id)}
                    >
                      <td
                        style={{
                          background: getStatusColor(comunicacao.status),
                          width: "5%",
                        }}
                      >
                        <div className={styles.tdDivIdComunicacao}>
                          <div>Nº</div>
                          <div>{comunicacao.id}</div>
                        </div>
                        <div style={{ color: "#ffffff", marginTop: "10px" }}>
                          <strong>
                            {comunicacao.useral?.aluno?.turma.cia.name}
                          </strong>
                        </div>
                      </td>

                      {/* Comunicante */}
                      <td style={{ padding: "8px", verticalAlign: "top" }}>
                        <div className={styles.divtabelaComunicacao}>
                          <div>
                            <FaUserCircle fontSize={18} />
                          </div>
                          <div style={{ lineHeight: 1.2 }}>
                            <p style={{ margin: 0, fontSize: "0.7rem" }}>
                              <strong>
                                {comunicacao.usercom?.pg}{" "}
                                {comunicacao.usercom?.nomeGuerra} |{" "}
                                {comunicacao.usercom?.funcao}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <strong>Motivo:</strong> {comunicacao.motivo}
                          </div>
                          <div>
                            <strong>Grau:</strong> {comunicacao.natureza} |{" "}
                            {comunicacao.grauMotivo}
                          </div>
                          <div>
                            <strong>Data:</strong>{" "}
                            {new Date(
                              comunicacao.dataInicio,
                            ).toLocaleDateString("pt-BR")}{" "}
                            às {comunicacao.horaInicio}
                          </div>
                        </div>
                      </td>

                      {/* Aluno */}
                      <td style={{ padding: "8px", verticalAlign: "top" }}>
                        <div className={styles.divtabelaComunicacao}>
                          <div>
                            <FaUserCircle fontSize={18} />
                          </div>
                          <div style={{ lineHeight: 1.2 }}>
                            <p style={{ margin: 0, fontSize: "0.7rem" }}>
                              <strong>
                                {comunicacao.useral?.pg}{" "}
                                {comunicacao.useral?.nomeGuerra} |{" "}
                                {comunicacao.useral?.funcao}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <strong>Resposta:</strong>{" "}
                            {comunicacao.resposta
                              ? truncateText(comunicacao.resposta, 50)
                              : "-"}
                          </div>
                          <div>
                            <strong>Data:</strong>{" "}
                            {comunicacao.dataResp
                              ? new Date(comunicacao.dataResp).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      </td>

                      {/* Cmt Cia */}
                      <td style={{ padding: "8px", verticalAlign: "top" }}>
                        <div className={styles.divtabelaComunicacao}>
                          <div>
                            <FaUserCircle fontSize={18} />
                          </div>
                          <div style={{ lineHeight: 1.2 }}>
                            <p style={{ margin: 0, fontSize: "0.7rem" }}>
                              <strong>
                                {comunicacao.usercmtcia?.pg}{" "}
                                {comunicacao.usercmtcia?.nomeGuerra} |{" "}
                                {comunicacao.usercmtcia?.funcao}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <strong>Parecer:</strong>{" "}
                            {comunicacao.parecerCmtCia
                              ? truncateText(comunicacao.parecerCmtCia, 60)
                              : "Aguardando..."}
                          </div>
                          <div>
                            <strong>Data:</strong>{" "}
                            {comunicacao.dataParecerCmtCia
                              ? new Date(
                                  comunicacao.dataParecerCmtCia,
                                ).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      </td>
                      {/* Cmt Cia */}

                      {/* Cmt CA */}
                      <td style={{ padding: "8px", verticalAlign: "top" }}>
                        <div className={styles.divtabelaComunicacao}>
                          <div>
                            <FaUserCircle fontSize={18} />
                          </div>
                          <div style={{ lineHeight: 1.2 }}>
                            <p style={{ margin: 0, fontSize: "0.7rem" }}>
                              <strong>
                                {comunicacao.userca?.pg}{" "}
                                {comunicacao.userca?.nomeGuerra} |{" "}
                                {comunicacao.userca?.funcao}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <strong>Parecer:</strong>{" "}
                            {comunicacao.parecerCa
                              ? truncateText(comunicacao.parecerCa, 60)
                              : "Aguardando..."}
                          </div>
                          <div>
                            <strong>Data:</strong>{" "}
                            {comunicacao.dataParecerCa
                              ? new Date(
                                  comunicacao.dataParecerCa,
                                ).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      </td>
                      {/* Cmt CA */}

                      {/* SubComando */}
                      <td style={{ padding: "8px", verticalAlign: "top" }}>
                        <div className={styles.divtabelaComunicacao}>
                          <div>
                            <FaUserCircle fontSize={18} />
                          </div>
                          <div style={{ lineHeight: 1.2 }}>
                            <p style={{ margin: 0, fontSize: "0.7rem" }}>
                              <strong>
                                {comunicacao.usersubcom?.pg}{" "}
                                {comunicacao.usersubcom?.nomeGuerra} |{" "}
                                {comunicacao.usersubcom?.funcao}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <strong>Parecer:</strong>{" "}
                            {comunicacao.parecerSubcom
                              ? truncateText(comunicacao.parecerSubcom, 60)
                              : "Aguardando..."}
                          </div>
                          <div>
                            <strong>Data:</strong>{" "}
                            {comunicacao.dataParecerSubcom
                              ? new Date(
                                  comunicacao.dataParecerSubcom,
                                ).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      </td>
                      {/* SubComando */}

                      {/* Status */}
                      <td style={{ padding: "8px", verticalAlign: "top" }}>
                        <div className={styles.divtabelaComunicacao}>
                          <strong> SITUAÇÃO DA COMUNICAÇÃO</strong>
                        </div>
                        <div>
                          <div>
                            <strong>Status:</strong>{" "}
                            {comunicacao.status ? comunicacao.status : "-"}
                          </div>
                          <div>
                            <strong>Data:</strong>{" "}
                            {comunicacao.dtAtualizacaoStatus
                              ? new Date(
                                  comunicacao.dtAtualizacaoStatus,
                                ).toLocaleString()
                              : "-"}
                          </div>
                        </div>
                      </td>
                      {/* Status */}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComunicacaosPage;
