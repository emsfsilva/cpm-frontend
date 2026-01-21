"use client";

import { useEffect, useState } from "react";
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

export default function PerfilPage() {
  const [userSelecionado, setUserSelecionado] = useState<any>(null);
  const [autorizacoes, setAutorizacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [despachoSelecionado, setDespachoSelecionado] = useState<any>(null);

  // 🔹 Carrega dados do usuário logado
  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userData="));

    if (!userCookie) return;

    try {
      const userString = userCookie.split("=")[1];
      const userData = JSON.parse(decodeURIComponent(userString));
      setUserSelecionado(userData);

      // 🔹 Busca as autorizações do aluno logado
      fetch(`/api/aluno/autorizacao?id=${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAutorizacoes(data);
        })
        .catch((err) => {
          console.error("Erro ao buscar autorizações:", err);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Erro ao parsear cookie do usuário:", err);
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Carregando dados...</div>;

  // 🔹 Filtrando por status
  const validas = autorizacoes.filter((a) => a.statusAut === "Autorizada");
  const autorizadacomrestricao = autorizacoes.filter(
    (a) => a.statusAut === "Autorizada com restrição"
  );
  const negadas = autorizacoes.filter((a) => a.statusAut === "Negada");
  const pendentes = autorizacoes.filter((a) => a.statusAut === "Pendente");

  // 🔹 Função para renderizar os dias
  const renderDias = (aut: any) => {
    const dias = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

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

              {/* Mostra horaInicio somente se ativo for true */}
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

  const formatarData = (dataStr) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const renderAutorizacao = (aut: any, tipo: string) => {
    let icon;
    let corBg;
    let IconComp;
    switch (tipo) {
      case "valida":
        IconComp = FaCheckSquare;
        corBg = "#46cb32";
        break;
      case "autorizadacomrestricao":
        IconComp = FaCheckSquare;
        corBg = "#129f69";
        break;
      case "negada":
        IconComp = FaTimes;
        corBg = "#c41616";
        break;
      case "pendente":
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
          {(tipo === "valida" || tipo === "autorizadacomrestricao") &&
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

          {/* Seções */}
          <div style={{ paddingTop: "20px" }}>
            <h3 className={styles.divEnderecoPerfilTitulo}>Válidas</h3>

            <div style={{ paddingBottom: "40px" }}>
              {validas.length === 0 && autorizadacomrestricao.length === 0 ? (
                <span>Nenhuma autorização válida.</span>
              ) : (
                <>
                  {validas.map((a) => renderAutorizacao(a, "valida"))}
                  {autorizadacomrestricao.map((a) =>
                    renderAutorizacao(a, "autorizadacomrestricao")
                  )}
                </>
              )}
            </div>

            <h3 className={styles.divEnderecoPerfilTitulo}>Negadas</h3>
            <div style={{ paddingBottom: "40px" }}>
              {negadas.length > 0
                ? negadas.map((a) => renderAutorizacao(a, "negada"))
                : "Nenhuma autorização negada."}
            </div>

            <h3 className={styles.divEnderecoPerfilTitulo}>Pendentes</h3>
            {pendentes.length > 0
              ? pendentes.map((a) => renderAutorizacao(a, "pendente"))
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
              {/* Imagem à esquerda */}
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={80}
                height={80}
              />

              {/* Texto à direita */}
              <span style={{ textAlign: "right", flex: 1, fontSize: "16px" }}>
                {despachoSelecionado.despacho || "Nenhum despacho disponível."}
                <br />
                {despachoSelecionado.datadespacho
                  ? new Date(despachoSelecionado.datadespacho).toLocaleString(
                      "pt-BR",
                      {
                        timeZone: "America/Sao_Paulo",
                      }
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
