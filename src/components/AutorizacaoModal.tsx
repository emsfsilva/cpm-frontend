"use client";

import { useState } from "react";
import styles from "@/app/(privada)/privateLayout.module.css";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

interface AutorizacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    motivoAut: string;
    obsAut: string;
    userIdAut: number;
    userIdAlAut: number;
    dataInicio: string;
    horaInicio: string;
    dataFinal: string;
    seg: string;
    ter: string;
    qua: string;
    qui: string;
    sex: string;
    sab: string;
    dom: string;
  }) => void;
  userAlvo: any;
}

export default function AutorizacaoModal({
  isOpen,
  onClose,
  onSubmit,
  userAlvo,
}: AutorizacaoModalProps) {
  if (!isOpen) return null;

  const [motivoAut, setMotivoAut] = useState("");
  const [obsAut, setObsAut] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // Dias da semana
  const [dias, setDias] = useState({
    seg: "Não",
    ter: "Não",
    qua: "Não",
    qui: "Não",
    sex: "Não",
    sab: "Não",
    dom: "Não",
  });

  const toggleDia = (dia: keyof typeof dias) => {
    setDias((prev) => ({
      ...prev,
      [dia]: prev[dia] === "Sim" ? "Não" : "Sim",
    }));
  };

  const handleSalvar = () => {
    if (!motivoAut || !obsAut || !dataInicio || !horaInicio || !dataFinal) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit({
      motivoAut,
      obsAut,
      userIdAut: 0, // será sobrescrito no caller
      userIdAlAut: userAlvo.id,
      dataInicio,
      horaInicio,
      dataFinal,
      ...dias,
    });

    onClose();
  };

  return (
    <div className={styles.modalOverlayCadComunicacao} onClick={onClose}>
      <div
        className={styles.cadComunicacaoModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalRightCadAluno}>
          <h3>
            <strong>Nova Autorização</strong>
          </h3>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.alunoListImg}>
              {userAlvo?.imagemUrl ? (
                <Image
                  width={60}
                  height={60}
                  src={`/${userAlvo.imagemUrl.replace(/\\/g, "/")}`}
                  alt="Foto de Usuario"
                  className={styles.usuarioImagemList}
                />
              ) : (
                <FaUser className={styles.alunoSemImagem} />
              )}
            </div>

            <div>
              <strong>
                {userAlvo?.pg} {userAlvo?.orgao} {userAlvo?.nomeGuerra}
              </strong>
              <div>
                {userAlvo?.aluno?.turma?.name && (
                  <>
                    <strong>Turma:</strong> {userAlvo.aluno.turma.name}{" "}
                    {userAlvo.aluno.turma.cia.name}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Campos do formulário */}
          <div style={{ marginTop: "20px" }}>
            <label>
              <strong>Qual o motivo da autorização?</strong>
            </label>
            <input
              type="text"
              placeholder="Ex: Sair mais cedo da aula"
              className={styles.input}
              value={motivoAut}
              onChange={(e) => {
                const valor = e.target.value;
                if (valor.length <= 41) {
                  setMotivoAut(valor);
                }
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: motivoAut.length >= 41 ? "red" : "#555",
              }}
            >
              {motivoAut.length}/41 caracteres
            </p>

            <label style={{ marginTop: "10px" }}>
              <strong>Descreva o motivo da autorização:</strong>
            </label>
            <textarea
              className={styles.inputComunicacaoTextarea}
              value={obsAut}
              placeholder="Ex: Consulta médica"
              onChange={(e) => setObsAut(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <h4 style={{ marginTop: "20px" }}>
                  <strong>Data Inicial:</strong>
                </h4>

                <input
                  type="date"
                  className={styles.input}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>

              <div>
                <h4 style={{ marginTop: "20px" }}>
                  <strong>Data Final:</strong>
                </h4>

                <input
                  type="date"
                  className={styles.input}
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", marginTop: "10px" }}>
              <div style={{ width: "100%" }}>
                <h4 style={{ marginTop: "20px" }}>
                  <strong>Que horas você deseja inicar?</strong>
                </h4>

                <input
                  type="time"
                  className={styles.input}
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
            </div>

            <h4 style={{ marginTop: "20px" }}>
              <strong>Quais dias você deseja autorização?</strong>
            </h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["seg", "ter", "qua", "qui", "sex", "sab", "dom"].map((dia) => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => toggleDia(dia as keyof typeof dias)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      dias[dia as keyof typeof dias] === "Sim"
                        ? "#007bff"
                        : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  {dia.toUpperCase()}
                </button>
              ))}
            </div>

            <div className={styles.botaoFooterCadAluno} onClick={handleSalvar}>
              <span>SALVAR</span>
            </div>

            <div className={styles.botaoFooterCancelar} onClick={onClose}>
              CANCELAR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
