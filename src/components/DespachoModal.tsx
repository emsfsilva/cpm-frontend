"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/(privada)/privateLayout.module.css";

interface DespachoModalProps {
  autorizacaoId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DespachoModal({
  autorizacaoId,
  onClose,
  onSuccess,
}: DespachoModalProps) {
  const [despacho, setDespacho] = useState("");
  const [motivoAut, setmotivoAut] = useState("");
  const [horaInicio, sethoraInicio] = useState("");
  const [statusAut, setStatusAut] = useState("Autorizada");
  const [obsAut, setObsAut] = useState("");
  const [userIdDespaAut, setUserIdDespaAut] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [diasSemana, setDiasSemana] = useState<Record<string, "Sim" | "Não">>({
    seg: "Não",
    ter: "Não",
    qua: "Não",
    qui: "Não",
    sex: "Não",
    sab: "Não",
    dom: "Não",
  });

  const listaDias = [
    { chave: "seg", label: "Seg" },
    { chave: "ter", label: "Ter" },
    { chave: "qua", label: "Qua" },
    { chave: "qui", label: "Qui" },
    { chave: "sex", label: "Sex" },
    { chave: "sab", label: "Sab" },
    { chave: "dom", label: "Dom" },
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userData="));
        if (userCookie) {
          const userString = userCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(userString));
          if (userData?.id) {
            setUserIdDespaAut(userData.id);
          }
        }

        const res = await fetch(`/api/autorizacao/${autorizacaoId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erro ao buscar despacho");
        }

        setDespacho(data.despacho || "");
        setmotivoAut(data.motivoAut || "");
        sethoraInicio(data.horaInicio || "");
        setStatusAut(data.statusAut || "Autorizada");
        setObsAut(data.obsAut || "");

        setDiasSemana({
          seg: data.seg || "Não",
          ter: data.ter || "Não",
          qua: data.qua || "Não",
          qui: data.qui || "Não",
          sex: data.sex || "Não",
          sab: data.sab || "Não",
          dom: data.dom || "Não",
        });
      } catch (err: unknown) {
        setError("Erro ao carregar dados da autorização.");
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Erro desconhecido ao carregar autorização");
        }
        console.error(err);
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarDados();
  }, [autorizacaoId]);

  const toggleDia = (chave: string) => {
    setDiasSemana((prev) => ({
      ...prev,
      [chave]: prev[chave] === "Sim" ? "Não" : "Sim",
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userIdDespaAut) {
        throw new Error("Usuário logado não identificado.");
      }

      const res = await fetch("/api/autorizacao/despacho", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: autorizacaoId,
          despacho,
          motivoAut,
          horaInicio,
          statusAut,
          obsAut,
          userIdDespaAut,
          ...diasSemana,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao despachar");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao salvar despacho.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (carregandoDados) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>Carregando dados do despacho...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.tituloListar}>
          Despacho da Autorização #{autorizacaoId}
        </h2>

        <div style={{ display: "flex", width: "100%", paddingBottom: "20px" }}>
          <div style={{ width: "80%" }}>
            <h3>Motivo da Solicitação</h3>
            <input
              className={styles.input}
              value={motivoAut}
              onChange={(e) => setmotivoAut(e.target.value)}
            />
          </div>
          <div style={{ width: "20%" }}>
            <h3>Hora de Inicio</h3>
            <input
              type="time"
              className={styles.input}
              value={horaInicio}
              onChange={(e) => sethoraInicio(e.target.value)}
            />
          </div>
        </div>

        <h3>Despacho</h3>
        <textarea
          className={styles.inputEnquadramentoTextarea}
          value={despacho}
          onChange={(e) => setDespacho(e.target.value)}
          placeholder="Ex: Autorizo a saída para tratamento com limitação de horários."
          rows={3}
          maxLength={200}
        />
        <div className={styles.charCounter}>
          {despacho.length} / 200 caracteres
        </div>

        <h3>Status</h3>
        <select
          className={styles.inputEnquadramento}
          value={statusAut}
          onChange={(e) => setStatusAut(e.target.value)}
        >
          <option value="Autorizada">Autorizada</option>
          <option value="Autorizada com restrição">
            Autorizada com restrição
          </option>
          <option value="Negada">Negada</option>
          <option value="Arquivado">Arquivar</option>
        </select>

        <h3>Dias da semana autorizados</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          {listaDias.map((dia) => (
            <button
              key={dia.chave}
              type="button"
              onClick={() => toggleDia(dia.chave)}
              style={{
                flex: "1 0 25%",
                padding: "8px",
                backgroundColor:
                  diasSemana[dia.chave] === "Sim" ? "#4caf50" : "#ccc",
                color: diasSemana[dia.chave] === "Sim" ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {dia.label}
            </button>
          ))}
        </div>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <div className={styles.modalActions}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={styles.enviarRespBtn}
          >
            {loading ? "Salvando..." : "Enviar despacho"}
          </button>
          <button
            onClick={onClose}
            className={styles.cancelarBtn}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
