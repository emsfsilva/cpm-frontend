"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaAngleLeft,
  FaCheckSquare,
  FaExclamationTriangle,
  FaHandPointUp,
  FaSearch,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import styles from "../../privateLayout.module.css";
import Image from "next/image";

// 🔹 Tipos
interface Usuario {
  id: string;
  name: string;
  imagemUrl?: string;
}

interface AlunoAPI {
  userId: number;
  name?: string;
  nomeGuerra?: string;
  imagemUrl?: string;
}

type StatusAut =
  | "Autorizada"
  | "Autorizada com restrição"
  | "Negada"
  | "Pendente";

interface Autorizacao {
  id: string;
  motivoAut: string;
  statusAut: StatusAut;
  dataInicio: string;
  dataFinal: string;
  horaInicio?: string;
  seg?: "Sim" | "Não";
  ter?: "Sim" | "Não";
  qua?: "Sim" | "Não";
  qui?: "Sim" | "Não";
  sex?: "Sim" | "Não";
  sab?: "Sim" | "Não";
  dom?: "Sim" | "Não";
  despacho?: string;
  datadespacho?: string;
}

export default function AutorizacaoPage() {
  const searchParams = useSearchParams();
  const userIdQuery = searchParams.get("userId"); // userId do dependente (se acessado pelo responsável)

  const [userSelecionado, setUserSelecionado] = useState<Usuario | null>(null);
  const [autorizacoes, setAutorizacoes] = useState<Autorizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [despachoSelecionado, setDespachoSelecionado] =
    useState<Autorizacao | null>(null);

  useEffect(() => {
    console.log("API URL atual:", process.env.NEXT_PUBLIC_API_BASE_URL);

    const fetchData = async () => {
      setLoading(true);
      try {
        let idToFetch = userIdQuery; // pode ser userId do dependente ou null
        let usuarioData: Usuario | null = null;

        if (!idToFetch) {
          // 🔹 Usuário logado (aluno)
          const userCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userData="));
          if (!userCookie) return;

          const userString = userCookie.split("=")[1];
          const userData: Usuario = JSON.parse(decodeURIComponent(userString));
          usuarioData = userData;
          idToFetch = userData.id;
        } else {
          // 🔹 Dependente: buscar dados do aluno correto
          const resAluno = await fetch(`/api/aluno?id=${idToFetch}`);
          if (!resAluno.ok) throw new Error("Erro ao buscar dados do aluno");

          const alunoDataArray: AlunoAPI[] = await resAluno.json();
          console.log("A variavel alunoDataArray é", alunoDataArray);

          if (!alunoDataArray || alunoDataArray.length === 0) {
            throw new Error("Nenhum dado de aluno encontrado");
          }

          // 🔹 Encontrar o aluno correto pelo userId da query
          const alunoData = alunoDataArray.find(
            (a) => a.userId === Number(idToFetch),
          );

          if (!alunoData) throw new Error("Aluno não encontrado no array");

          usuarioData = {
            id: String(alunoData.userId),
            name: alunoData.name || alunoData.nomeGuerra || "Aluno",
            imagemUrl: alunoData.imagemUrl || "",
          };
        }

        setUserSelecionado(usuarioData);

        // 🔹 Buscar autorizações do aluno
        const resAut = await fetch(`/api/aluno/autorizacao?id=${idToFetch}`);
        const dataAut: Autorizacao[] = await resAut.json();
        setAutorizacoes(dataAut);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userIdQuery]);

  if (loading) return <div>Carregando dados...</div>;

  // 🔹 Filtrando por status
  const validas = autorizacoes.filter((a) => a.statusAut === "Autorizada");
  const autorizadacomrestricao = autorizacoes.filter(
    (a) => a.statusAut === "Autorizada com restrição",
  );
  const negadas = autorizacoes.filter((a) => a.statusAut === "Negada");
  const pendentes = autorizacoes.filter((a) => a.statusAut === "Pendente");

  const renderDias = (aut: Autorizacao) => {
    const dias: (keyof Autorizacao)[] = [
      "seg",
      "ter",
      "qua",
      "qui",
      "sex",
      "sab",
      "dom",
    ];

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          marginTop: "2px",
          marginBottom: "3px",
        }}
      >
        {dias.map((d) => {
          const ativo = aut[d] === "Sim";
          const hora = aut.horaInicio;
          return (
            <div
              key={d}
              style={{
                background: ativo ? "#46cb32" : "#999",
                color: "#fff",
                borderRadius: "6px",
                fontSize: "10px",
                textAlign: "center",
                padding: "6px 8px",
                minWidth: "40px",
                flex: "0 0 auto",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{d.toUpperCase()}</div>
              {ativo && hora && (
                <div
                  style={{
                    fontSize: "9px",
                    marginTop: "3px",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "4px",
                    padding: "1px 1px",
                  }}
                >
                  {hora}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const renderAutorizacao = (aut: Autorizacao, tipo: StatusAut) => {
    let IconComp;
    let corBg;
    switch (tipo) {
      case "Autorizada":
        IconComp = FaCheckSquare;
        corBg = "#46cb32";
        break;
      case "Autorizada com restrição":
        IconComp = FaCheckSquare;
        corBg = "#129f69";
        break;
      case "Negada":
        IconComp = FaTimes;
        corBg = "#c41616";
        break;
      case "Pendente":
        IconComp = FaExclamationTriangle;
        corBg = "#e4800e";
        break;
    }

    return (
      <div key={aut.id} className={styles.itemMenuPerfilPrincipal}>
        <div style={{ marginLeft: "10px", width: "10%" }}>
          <IconComp color={corBg} size={30} />
        </div>
        <div style={{ marginLeft: "10px", width: "90%" }}>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {aut.motivoAut}
          </div>
          <div className={styles.itemMenuPerfilLabel}>
            {formatarData(aut.dataInicio)} a {formatarData(aut.dataFinal)}
          </div>
          {(tipo === "Autorizada" || tipo === "Autorizada com restrição") &&
            renderDias(aut)}
          <div
            onClick={() => setDespachoSelecionado(aut)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              width: "95%",
              background: corBg,
              borderRadius: "15px",
            }}
          >
            <span
              style={{
                color: "#fff",
                background: corBg,
                borderRadius: "15px",
                fontSize: "12px",
                padding: "5px",
              }}
            >
              {aut.statusAut}
            </span>
            <FaHandPointUp
              color={"#fff"}
              size={16}
              style={{ cursor: "pointer" }}
              title="Ver despacho"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "10px" }}>
      {userSelecionado ? (
        <>
          {/* Cabeçalho */}
          <div className={styles.divPrincipalUsuarioPerfil}>
            <div>
              <FaAngleLeft size={30} />
            </div>
            <div className={styles.tituloPerfil}>
              <span>Autorizações</span>
            </div>
            <div>
              <FaSearch size={20} />
            </div>
          </div>

          {/* Nome e imagem */}
          <div
            className={styles.itemMenuPerfilPrincipal}
            style={{ marginBottom: "20px" }}
          >
            <div>
              {userSelecionado.imagemUrl ? (
                <Image
                  width={40}
                  height={40}
                  src={`/${userSelecionado.imagemUrl.replace(/\\/g, "/")}`}
                  alt="Foto do usuário"
                  className={styles.imagemUsuarioPerfilDependente}
                />
              ) : (
                <FaUser className={styles.semImagemUsuarioPerfilDependente} />
              )}
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Nome Completo</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.name}
              </div>
            </div>
          </div>

          {/* Seções de autorizações */}
          <div style={{ paddingTop: "20px" }}>
            <h3 className={styles.divEnderecoPerfilTitulo}>Válidas</h3>
            <div style={{ paddingBottom: "40px" }}>
              {validas.length === 0 && autorizadacomrestricao.length === 0 ? (
                <span>Nenhuma autorização válida.</span>
              ) : (
                <>
                  {validas.map((a) => renderAutorizacao(a, "Autorizada"))}
                  {autorizadacomrestricao.map((a) =>
                    renderAutorizacao(a, "Autorizada com restrição"),
                  )}
                </>
              )}
            </div>

            <h3 className={styles.divEnderecoPerfilTitulo}>Negadas</h3>
            <div style={{ paddingBottom: "40px" }}>
              {negadas.length > 0
                ? negadas.map((a) => renderAutorizacao(a, "Negada"))
                : "Nenhuma autorização negada."}
            </div>

            <h3 className={styles.divEnderecoPerfilTitulo}>Pendentes</h3>
            {pendentes.length > 0
              ? pendentes.map((a) => renderAutorizacao(a, "Pendente"))
              : "Nenhuma autorização pendente."}
          </div>
        </>
      ) : (
        <div>Carregando dados do usuário...</div>
      )}

      {despachoSelecionado && (
        <div
          onClick={() => setDespachoSelecionado(null)}
          className={styles.divModalAutorizacaoPrincipal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.divModalAutorizacaoSecundaria}
          >
            <div
              style={{
                background: "#273c75",
                height: "40px",
                alignContent: "center",
              }}
            >
              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                CORPO DE ALUNOS | C.A.
              </h3>
            </div>

            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#333",
                wordWrap: "break-word",
                padding: "20px",
                whiteSpace: "pre-wrap",
                marginBottom: "20px",
              }}
            >
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={80}
                height={80}
              />
              <span style={{ textAlign: "right", flex: 1, fontSize: "16px" }}>
                {despachoSelecionado.despacho || "Nenhum despacho disponível."}
                <br />
                {despachoSelecionado.datadespacho
                  ? new Date(despachoSelecionado.datadespacho).toLocaleString(
                      "pt-BR",
                      {
                        timeZone: "America/Sao_Paulo",
                      },
                    )
                  : ""}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
