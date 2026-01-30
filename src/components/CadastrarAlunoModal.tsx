"use client";

import { useEffect, useState } from "react";
import styles from "@/app/(privada)/privateLayout.module.css";

interface Responsavel {
  id: number;
  name: string;
  pg: string;
}

interface Turma {
  id: number;
  name: string;
  cia: {
    id: number;
    name: string;
  };
}

interface UsuarioApi {
  id: number;
  name: string;
  pg: string;
  typeUser: number;
}

export interface Aluno {
  id: number;
  grauInicial: string;
  grauAtual: string;
  turma: Turma;
  responsavel1?: Responsavel | null;
  responsavel2?: Responsavel | null;
  userId?: number;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: Aluno) => void; // <- ALTERADO
  initialData?: Aluno | null;
};

export default function CadastrarAlunoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}: Props) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<Aluno>({
    id: 0,
    grauInicial: "",
    grauAtual: "",
    turma: {
      id: 0,
      name: "",
      cia: { id: 0, name: "" },
    },
    responsavel1: undefined,
    responsavel2: undefined,
  });

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    async function carregarResponsaveis() {
      try {
        const res = await fetch("/api/user");
        const data: UsuarioApi[] = await res.json();

        if (res.ok) {
          const responsaveisFiltrados = data.filter(
            (user) => user.typeUser !== 1,
          );
          setResponsaveis(responsaveisFiltrados);
        } else {
          console.error("Erro ao carregar responsáveis:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar responsáveis:", error);
      }
    }

    carregarResponsaveis();
  }, []);

  useEffect(() => {
    async function carregarTurmas() {
      try {
        const res = await fetch("/api/turma");
        const data = await res.json();

        if (res.ok) {
          setTurmas(data);
        } else {
          console.error("Erro ao carregar turmas:", data.error || data);
        }
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      }
    }

    carregarTurmas();
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlayCadDetalhesAluno} onClick={onClose}>
      <div
        className={styles.cadDetalhesAlunoModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalRightCadAluno}>
          <h3>
            <strong>
              {isEditMode ? "Informações do Aluno" : "Cadastrar Aluno"}
            </strong>
          </h3>

          <div style={{ flex: 1, padding: "5px", marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Turma do Aluno:
            </label>
            <select
              style={{ width: "100%" }}
              className={styles.inputCadAlunoApenasinput}
              value={form.turma.id}
              onChange={(e) => {
                const turmaId = Number(e.target.value);
                const turmaSelecionada = turmas.find((t) => t.id === turmaId);
                if (turmaSelecionada) {
                  setForm((prev) => ({
                    ...prev,
                    turma: turmaSelecionada,
                  }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    turma: { id: 0, name: "", cia: { id: 0, name: "" } },
                  }));
                }
              }}
            >
              <option value="">Selecione uma turma</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.name} - {turma.cia.name}
                </option>
              ))}
            </select>
          </div>

          {/* Responsável 1 */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Responsável 1:
            </label>
            <select
              style={{ width: "100%" }}
              className={styles.inputCadAlunoApenasinput}
              value={form.responsavel1?.id || 0}
              onChange={(e) => {
                const id = parseInt(e.target.value, 10);
                const responsavel = responsaveis.find((r) => r.id === id);
                setForm((prev) => ({
                  ...prev,
                  responsavel1: id === 0 ? undefined : responsavel,
                }));
              }}
            >
              <option value="0">Sem responsável</option>
              {responsaveis.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {r.pg}
                </option>
              ))}
            </select>
          </div>

          {/* Responsável 2 */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Responsável 2:
            </label>
            <select
              style={{ width: "100%" }}
              className={styles.inputCadAlunoApenasinput}
              value={form.responsavel2?.id || 0}
              onChange={(e) => {
                const id = parseInt(e.target.value, 10);
                const responsavel = responsaveis.find((r) => r.id === id);
                setForm((prev) => ({
                  ...prev,
                  responsavel2: id === 0 ? undefined : responsavel,
                }));
              }}
            >
              <option value="0">Sem responsável</option>
              {responsaveis.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {r.pg}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {/* Botão SALVAR */}
            <button
              style={{ marginRight: "5px", fontSize: "15px", padding: "5px" }}
              onClick={() => onSubmit(form)}
              className={styles.botaoFooterCadAluno}
            >
              {isEditMode ? "EDITAR" : "SALVAR"}
            </button>

            {/* Botão CANCELAR */}
            <button
              style={{ fontSize: "15px", padding: "5px" }}
              onClick={onClose}
              className={styles.botaoFooterCancelar}
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
