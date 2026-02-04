// src/app/(privada)/autorizacao/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../privateLayout.module.css";
import Image from "next/image";
import DespachoModal from "@/components/DespachoModal";
import { toast } from "sonner";

import {
  FaArchive,
  FaCheckSquare,
  FaEdit,
  FaGraduationCap,
  FaRegSquare,
  FaUser,
} from "react-icons/fa";

interface User {
  id: number;
  pg: string;
  name: string;
  nomeGuerra: string;
  funcao: string;
  imagemPerfil?: string | null;
}

interface Autorizacao {
  id: number;
  userIdAut: number;
  userIdAlAut: number;
  motivoAut: string;
  dataInicio: string;
  dataFinal: string;
  horaInicio: string;
  horaFinal: string;
  seg: string;
  ter: string;
  qua: string;
  qui: string;
  sex: string;
  sab: string;
  dom: string;
  despacho: string;
  datadespacho: string;
  statusAut: string;
  obsAut: string;
  userIdAl: number;
  createdAt: string;
  updatedAt: string;
  situacaoAtual: string;
  useraut?: User;
  userdespaaut?: User;
  useralaut?: User;
  alunoInfo?: {
    turma?: {
      id: number;
      name: string;
    };
    cia?: {
      id: number;
      name: string;
    };
    responsavel1?: User;
    responsavel2?: User;
  };
}

export default function AutorizacaoPage() {
  const [autorizacoes, setAutorizacoes] = useState<Autorizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtroFuncao, setFiltroFuncao] = useState<string>("Todos");
  const [filteredAutorizacoes, setFilteredAutorizacoes] = useState<
    Autorizacao[]
  >([]);
  const [autorizacaoSelecionada, setAutorizacaoSelecionada] =
    useState<Autorizacao | null>(null);

  useEffect(() => {
    const fetchAutorizacoes = async () => {
      try {
        const res = await fetch("/api/autorizacao");

        const data: Autorizacao[] = await res.json();

        if (!res.ok) {
          throw new Error("Erro ao buscar autorizações");
        }

        setAutorizacoes(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAutorizacoes();
  }, []);

  // 👇 Este aqui fecha o menu suspenso ao clicar fora
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbertoId(null);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  // ✅👇 ESTE É O NOVO: atualiza as autorizações filtrados com base na busca
  useEffect(() => {
    const termoBusca = searchTerm.toLowerCase();
    const filtroFuncaoLower = filtroFuncao.toLowerCase();

    const filtrados = autorizacoes.filter((aut) => {
      const statusMatch =
        filtroFuncao === "Todos" ||
        aut.statusAut.toLowerCase() === filtroFuncaoLower;
      const buscaMatch =
        aut.statusAut.toLowerCase().includes(termoBusca) ||
        aut.motivoAut.toLowerCase().includes(termoBusca) ||
        aut.useraut?.nomeGuerra.toLowerCase().includes(termoBusca) ||
        aut.useralaut?.nomeGuerra.toLowerCase().includes(termoBusca);

      return statusMatch && buscaMatch;
    });

    setFilteredAutorizacoes(filtrados);
  }, [searchTerm, filtroFuncao, autorizacoes]);

  //INICIO ABRIR DETALHES DA AUTORIZAÇÃO
  const handleView = async (id: number) => {
    if (autorizacaoSelecionada?.id === id) {
      setAutorizacaoSelecionada(null);
      return;
    }

    try {
      const res = await fetch(`/api/autorizacao/${id}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Erro ao buscar detalhes da Autorização",
        );
      }

      const autorizacaoDetalhe: Autorizacao = await res.json();
      setAutorizacaoSelecionada(autorizacaoDetalhe);
    } catch (err: unknown) {
      console.error("Erro ao buscar detalhes da Autorização:", err);
    }
  };
  //FIM ABRIR DETALHES DA AUTORIZAÇÃO

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const dias: { chave: keyof Autorizacao; label: string }[] = [
    { chave: "seg", label: "Seg" },
    { chave: "ter", label: "Ter" },
    { chave: "qua", label: "Qua" },
    { chave: "qui", label: "Qui" },
    { chave: "sex", label: "Sex" },
    { chave: "sab", label: "Sab" },
    { chave: "dom", label: "Dom" },
  ];

  const handleAbrirModalDespacho = () => {
    setModalAberto(true);
  };
  const handleFecharModalDespacho = () => {
    setModalAberto(false);
  };
  const handleDespachoSucesso = async () => {
    const res = await fetch("/api/autorizacao");
    const data = await res.json();
    setAutorizacoes(data);

    // Atualiza a div da direita
    if (autorizacaoSelecionada?.id) {
      await handleView(autorizacaoSelecionada.id);
    }

    toast.success("Despacho realizado com sucesso!");
  };

  if (loading) return <p>Carregando autorizações...</p>;
  if (error) return <p>Erro: {error}</p>;

  // 🔹 Separar e ordenar por situacaoAtual
  const vigentes = filteredAutorizacoes
    .filter((a) => a.situacaoAtual === "Vigente")
    .sort((a, b) => b.id - a.id); // opcional: mais recentes primeiro
  const expiradas = filteredAutorizacoes
    .filter((a) => a.situacaoAtual === "Expirada")
    .sort((a, b) => b.id - a.id);

  return (
    <div className={styles.alunosContainer}>
      {/* inicio da div da esquerda */}
      <div className={styles.listaEsquerda}>
        <h1 className={styles.tituloListar}>Autorizações</h1>
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <div style={{ width: "100%" }}>
            <input
              className={styles.inputBuscar}
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className={styles.divFiltroUsuarios}>
          {["Pendente", "Autorizada", "Negada"].map((label) => (
            <span
              key={label}
              className={`${styles.spanFiltroUsuarios} ${
                filtroFuncao === label ? styles.filtroAtivo : ""
              }`}
              onClick={() => setFiltroFuncao(label)}
            >
              {label}
            </span>
          ))}
        </div>

        {vigentes.length > 0 ? (
          <>
            <h2
              style={{
                marginBottom: "10px",
                color: "#202020",
                fontSize: "12px",
                fontFamily: "bold",
              }}
            >
              Vigentes
            </h2>

            {/* 🔹 Lista das autorizações Vigentes */}
            {vigentes.map((autorizacao) => (
              <div
                key={autorizacao.id}
                className={`${styles.listdeAlunos} ${
                  autorizacaoSelecionada?.id === autorizacao.id
                    ? styles.alunoSelecionado
                    : ""
                }`}
                onClick={() => handleView(autorizacao.id)}
              >
                <ul className={styles.itemAluno}>
                  <li style={{ position: "relative" }}>
                    <div
                      style={{ width: "10%", marginRight: "10px" }}
                      className={styles.alunoListImg}
                    >
                      <div>
                        <Image
                          src="/assets/images/logo.png"
                          alt="logo"
                          width={40}
                          height={40}
                        />
                        <div className={styles.divNumeroAutorizacao}>
                          Nº {autorizacao.id}
                        </div>
                      </div>
                    </div>

                    <div style={{ width: "80%" }}>
                      <div style={{ fontSize: "14px" }}>
                        <strong>{autorizacao.motivoAut}</strong>
                      </div>

                      <div className={styles.divItensMeioUsuario}>
                        <FaUser />
                        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                          Solicitante:
                        </span>
                        <span style={{ marginLeft: "5px" }}>
                          {autorizacao.useraut?.pg}{" "}
                          {autorizacao.useraut?.nomeGuerra} |{" "}
                          {autorizacao.useraut?.funcao}
                        </span>
                      </div>

                      <div className={styles.divItensMeioUsuario}>
                        <FaGraduationCap />
                        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                          Aluno:
                        </span>
                        <span style={{ marginLeft: "5px" }}>
                          {autorizacao.useralaut?.nomeGuerra} |{" "}
                          {autorizacao.alunoInfo?.turma?.name} -{" "}
                          {autorizacao.alunoInfo?.cia?.name}
                        </span>
                      </div>

                      <div style={{ fontSize: "14px", color: "#868686" }}>
                        Status:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              autorizacao.statusAut === "Autorizada"
                                ? "#19d044"
                                : autorizacao.statusAut ===
                                    "Autorizada com restrição"
                                  ? "#108444"
                                  : autorizacao.statusAut === "Negada"
                                    ? "#f44336"
                                    : "#000000",
                          }}
                        >
                          {autorizacao.statusAut}
                        </span>
                      </div>

                      <div style={{ fontSize: "14px", color: "#868686" }}>
                        Período:{" "}
                        {new Date(
                          autorizacao.dataInicio + "T00:00:00",
                        ).toLocaleDateString()}{" "}
                        a{" "}
                        {new Date(
                          autorizacao.dataFinal + "T00:00:00",
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      style={{ width: "10%" }}
                      className={styles.alunoListImg}
                    >
                      <div>
                        <FaCheckSquare fontSize={20} color="#0e9169" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}

            {/* 🔻 Título das Expiradas */}
            {expiradas.length > 0 && (
              <h2
                style={{
                  marginTop: "25px",
                  marginBottom: "10px",
                  color: "#202020",
                  fontSize: "12px",
                  fontFamily: "bold",
                  borderTop: "1px solid #ddd",
                  paddingTop: "10px",
                }}
              >
                Expiradas
              </h2>
            )}

            {/* 🔹 Lista das Expiradas */}
            {expiradas.map((autorizacao) => (
              <div
                key={autorizacao.id}
                className={`${styles.listdeAlunos} ${
                  autorizacaoSelecionada?.id === autorizacao.id
                    ? styles.alunoSelecionado
                    : ""
                }`}
                onClick={() => handleView(autorizacao.id)}
              >
                <ul className={styles.itemAluno}>
                  <li style={{ position: "relative" }}>
                    <div
                      style={{ width: "10%", marginRight: "10px" }}
                      className={styles.alunoListImg}
                    >
                      <div>
                        <Image
                          src="/assets/images/logo.png"
                          alt="logo"
                          width={40}
                          height={40}
                        />
                        <div className={styles.divNumeroAutorizacao}>
                          Nº {autorizacao.id}
                        </div>
                      </div>
                    </div>

                    <div style={{ width: "80%" }}>
                      <div style={{ fontSize: "14px" }}>
                        <strong>{autorizacao.motivoAut}</strong>
                      </div>

                      <div className={styles.divItensMeioUsuario}>
                        <FaUser />
                        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                          Solicitante:
                        </span>
                        <span style={{ marginLeft: "5px" }}>
                          {autorizacao.useraut?.pg}{" "}
                          {autorizacao.useraut?.nomeGuerra} |{" "}
                          {autorizacao.useraut?.funcao}
                        </span>
                      </div>

                      <div className={styles.divItensMeioUsuario}>
                        <FaGraduationCap />
                        <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                          Aluno:
                        </span>
                        <span style={{ marginLeft: "5px" }}>
                          {autorizacao.useralaut?.nomeGuerra} |{" "}
                          {autorizacao.alunoInfo?.turma?.name} -{" "}
                          {autorizacao.alunoInfo?.cia?.name}
                        </span>
                      </div>

                      <div style={{ fontSize: "14px", color: "#868686" }}>
                        Status:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              autorizacao.statusAut === "Autorizada"
                                ? "#19d044"
                                : autorizacao.statusAut ===
                                    "Autorizada com restrição"
                                  ? "#108444"
                                  : autorizacao.statusAut === "Negada"
                                    ? "#f44336"
                                    : "#000000",
                          }}
                        >
                          {autorizacao.statusAut}
                        </span>
                      </div>

                      <div style={{ fontSize: "14px", color: "#868686" }}>
                        Período:{" "}
                        {new Date(
                          autorizacao.dataInicio + "T00:00:00",
                        ).toLocaleDateString()}{" "}
                        a{" "}
                        {new Date(
                          autorizacao.dataFinal + "T00:00:00",
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      style={{ width: "10%" }}
                      className={styles.alunoListImg}
                    >
                      <div>
                        <FaArchive fontSize={20} color="#b0b0b0" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </>
        ) : !error ? (
          <p>Não existem autorizações cadastradas</p>
        ) : (
          <p style={{ color: "red" }}>Erro ao buscar Autorizações</p>
        )}
      </div>
      {/* fim da div da esquerda */}

      {/* inicio da div da direita */}

      <div className={styles.detalhesDesktop}>
        <div style={{ width: "100%" }}>
          {autorizacaoSelecionada ? (
            <div>
              {/* Informações detalhadas */}
              <div className={styles.profileDetails}>
                <div style={{ padding: "10px", border: "1px solid #d4d0d0" }}>
                  <div className={styles.divDadosBasicosUserPrincipal}>
                    <div style={{ fontWeight: "bold" }}>
                      Detalhes da Autorização:
                    </div>
                    <button onClick={handleAbrirModalDespacho}>
                      <FaEdit />
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* motivo */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>
                        Motivo da autorização:
                      </label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {autorizacaoSelecionada.motivoAut}
                      </div>
                    </div>

                    {/* Data e hora de início */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>
                        Data/Hora Início:
                      </label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {new Date(
                          autorizacaoSelecionada.dataInicio + "T00:00:00",
                        ).toLocaleDateString()}{" "}
                        às {autorizacaoSelecionada.horaInicio}
                      </div>
                    </div>

                    {/* Data e hora de fim */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>
                        Data/Hora Final:
                      </label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {new Date(
                          autorizacaoSelecionada.dataFinal + "T00:00:00",
                        ).toLocaleDateString()}{" "}
                        às {autorizacaoSelecionada.horaFinal}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    {/* Solicitante */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Solicitante:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {autorizacaoSelecionada.useraut?.pg}{" "}
                        {autorizacaoSelecionada.useraut?.nomeGuerra}
                      </div>
                    </div>

                    {/* Aluno */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Aluno:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {autorizacaoSelecionada.useralaut?.nomeGuerra}
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Status:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {autorizacaoSelecionada.statusAut}
                      </div>
                    </div>
                  </div>

                  {/* dias da semana */}

                  <div
                    style={{
                      marginTop: "10px",
                      padding: "5px",
                      border: "1px solid #d4d0d0",
                    }}
                  >
                    <label style={{ fontSize: "12px" }}>
                      Dias Solicitados:
                    </label>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                        width: "100%",
                      }}
                    >
                      {dias.map((dia) => (
                        <div
                          key={dia.chave}
                          style={{
                            textAlign: "center",
                            justifyItems: "center",
                            flex: 1,
                          }}
                        >
                          <div style={{ fontSize: "24px" }}>
                            {autorizacaoSelecionada[dia.chave] === "Sim" ? ( // TypeScript agora entende
                              <FaCheckSquare color="green" />
                            ) : (
                              <FaRegSquare color="#918e8e" />
                            )}
                          </div>
                          <div style={{ fontSize: "18px", color: "#797777" }}>
                            {dia.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observações */}
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "5px",
                    }}
                  >
                    <label style={{ fontSize: "12px" }}>Observações:</label>
                    <div className={styles.divDadosBasicosUserTexto}>
                      {autorizacaoSelecionada.obsAut || "Sem observações"}
                    </div>
                  </div>

                  {/* desoacho da autorização */}
                  <div
                    style={{
                      marginTop: "50px",
                      padding: "5px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      Despacho da Autorização:
                    </div>
                    <label style={{ fontSize: "12px" }}>Observações:</label>
                    <div className={styles.divDadosBasicosUserTexto}>
                      <div
                        style={{
                          display: "flex",
                          padding: "20px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            justifyContent: "center",
                            justifyItems: "center",
                            textAlign: "center",
                            width: "10%",
                          }}
                        >
                          <FaUser
                            className={styles.alunoSemImagemAutorizacao}
                          />

                          <span
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            {autorizacaoSelecionada.userdespaaut?.pg}{" "}
                            {autorizacaoSelecionada.userdespaaut?.nomeGuerra}
                          </span>
                        </div>
                        <div
                          style={{
                            marginLeft: "14px",
                            width: "90%",
                            textAlign: "left",
                          }}
                        >
                          <span>
                            {autorizacaoSelecionada.despacho ||
                              "Aguadando decisão procedente ou improcedente"}
                          </span>{" "}
                          <br></br>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#676767",
                            }}
                          >
                            {autorizacaoSelecionada.datadespacho}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Selecione uma autorização para ver os detalhes</div>
          )}
        </div>
      </div>
      {modalAberto && autorizacaoSelecionada && (
        <DespachoModal
          autorizacaoId={autorizacaoSelecionada.id}
          onClose={handleFecharModalDespacho}
          onSuccess={handleDespachoSucesso}
        />
      )}
    </div>
  );
}
