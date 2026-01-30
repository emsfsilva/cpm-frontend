"use client";

import { useState } from "react";
import styles from "@/app/(privada)/privateLayout.module.css";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

// Tipos de props esperadas
interface UserAlvo {
  id: number;
  name?: string;
}

interface Turma {
  name: string;
  cia: {
    name: string;
  };
}

interface Aluno {
  turma?: Turma;
}

interface UserAlvo {
  id: number;
  imagemUrl?: string | null;
  pg?: string;
  orgao?: string;
  nomeGuerra?: string;
  aluno?: Aluno;
}

interface ComunicacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    motivo: string;
    descricaoMotivo: string;
    userIdAl: number;
    dataInicio: string;
    horaInicio: string;
  }) => void;
  userAlvo: UserAlvo;
}

export default function ComunicacaoModal({
  isOpen,
  onClose,
  onSubmit,
  userAlvo,
}: ComunicacaoModalProps) {
  const [motivoSelecionado, setMotivoSelecionado] = useState("");
  const [descricaoMotivo, setDescricaoMotivo] = useState("");
  const [dataInicio, setDataInicioSelecionado] = useState("");
  const [horaInicio, setHoraInicioSelecionado] = useState("");

  if (!isOpen) return null;

  const handleSalvar = () => {
    if (!motivoSelecionado || !descricaoMotivo || !dataInicio || !horaInicio) {
      alert("Preencha todos os campos.");
      return;
    }

    onSubmit({
      motivo: motivoSelecionado,
      descricaoMotivo,
      userIdAl: userAlvo?.id,
      dataInicio,
      horaInicio,
    });

    // Opcionalmente fecha a modal após submit
    onClose();
    setMotivoSelecionado("");
    setDescricaoMotivo("");
    setDataInicioSelecionado("");
    setHoraInicioSelecionado("");
  };

  return (
    <div className={styles.modalOverlayCadComunicacao} onClick={onClose}>
      <div
        className={styles.cadComunicacaoModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalRightCadAluno}>
          <h3 style={{ fontSize: "15px", paddingBottom: "10px" }}>
            <strong>Comunicação</strong>
          </h3>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.alunoListImg}>
              {userAlvo?.imagemUrl ? (
                <Image
                  width={60}
                  height={60}
                  src={`/${userAlvo.imagemUrl.replace(/\\/g, "/")}`}
                  alt={`Foto de Usuario`}
                  className={styles.usuarioImagemList}
                />
              ) : (
                <FaUser className={styles.alunoSemImagem} />
              )}
            </div>

            <div>
              <div>
                <strong>
                  {userAlvo?.pg} {userAlvo?.orgao} {userAlvo?.nomeGuerra}
                </strong>
              </div>
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

          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ width: "100%" }}>
                <ul>
                  {[
                    "Cabelo fora do Padrão",
                    "Faltou",
                    "Atraso",
                    "Proferiu palavra de baixo calão",
                    "Fora da sala de aula sem autorização",
                    "Comportamento incompativel",
                    "Alteração de uniforme",
                    "Alteração na apresentação",
                    "Não compareceu à formatura",
                    "Outros",
                  ].map((opcao, index) => (
                    <li key={index}>
                      <input
                        type="checkbox"
                        className={styles.inputComunicacaoDetails}
                        checked={motivoSelecionado === opcao}
                        onChange={() =>
                          setMotivoSelecionado(
                            motivoSelecionado === opcao ? "" : opcao,
                          )
                        }
                      />
                      {opcao}
                    </li>
                  ))}
                </ul>

                <h1 style={{ marginTop: "20px" }}>
                  <strong>Data e Hora do fato:</strong>
                </h1>

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between", // <-- Força extremidades
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    marginBottom: "20px",
                    padding: "15px",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <input
                      className={styles.input}
                      type="date"
                      name="dataInicio"
                      value={dataInicio}
                      onChange={(e) => setDataInicioSelecionado(e.target.value)}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <input
                      className={styles.input}
                      type="time"
                      name="horaInicio"
                      value={horaInicio}
                      onChange={(e) => setHoraInicioSelecionado(e.target.value)}
                    />
                  </div>
                </div>

                <h1 style={{ marginTop: "5px" }}>
                  <strong>Descrição detalhada do fato:</strong>
                </h1>
                <textarea
                  id="descricaoMotivo"
                  className={styles.inputComunicacaoTextarea}
                  value={descricaoMotivo}
                  onChange={(e) => setDescricaoMotivo(e.target.value)}
                />
              </div>
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
