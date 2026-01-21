"use client";

import { useEffect, useState } from "react";
import styles from "@/app/(privada)/privateLayout.module.css";
import { IMaskInput } from "react-imask";
import { FaUser } from "react-icons/fa";

interface User {
  id: number;
  imagemUrl: string;
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
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: User) => void;
  initialData?: User | null;
};

export default function UsuarioModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}: Props) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<User>({
    id: 0,
    imagemUrl: "",
    name: "",
    seduc: "",
    phone: "",
    cpf: "",
    orgao: "",
    pg: "",
    mat: 0,
    nomeGuerra: "",
    funcao: "",
    typeUser: 1,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: 0,
        imagemUrl: "",
        name: "",
        seduc: "",
        phone: "",
        cpf: "",
        orgao: "",
        pg: "",
        mat: 0,
        nomeGuerra: "",
        funcao: "",
        typeUser: 1,
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "funcao") {
      const newTypeUser = funcaoToTypeUser[value] || 1; // 1 como fallback
      setForm((prevForm) => ({
        ...prevForm,
        funcao: value,
        typeUser: newTypeUser,
      }));
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "mat"
          ? +value
          : name === "name" || name === "nomeGuerra"
          ? value.toUpperCase()
          : name === "seduc"
          ? value.toLowerCase()
          : value,
    }));
  };

  const funcaoToTypeUser: { [key: string]: number } = {
    Aluno: 1,
    Comum: 2,
    Monitor: 3,
    Civil: 4,
    Adm: 5,
    CmtCia: 6,
    CmtCa: 7,
    Comando: 8,
    Master: 10,
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlayCadAluno} onClick={onClose}>
      <div
        className={styles.cadAlunoModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalRightCadAluno}>
          <h3 style={{ fontSize: "15px", paddingBottom: "10px" }}>
            <strong>
              {isEditMode ? "Editar Usuário" : "Cadastrar Usuário"}
            </strong>
          </h3>

          <div style={{ textAlign: "center" }}>
            <div style={{ width: "20%", marginBottom: "1rem" }}>
              <FaUser className={styles.imgCadAluno} />
            </div>
            <div style={{ marginBottom: "1rem", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <input
                  className={styles.inputCadAlunoApenasinput}
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Nome completo"
                  onChange={handleInputChange}
                />

                <input
                  className={styles.inputCadAlunoApenasinput}
                  type="text"
                  name="seduc"
                  value={form.seduc}
                  placeholder="Seduc"
                  onChange={handleInputChange}
                />

                <IMaskInput
                  className={styles.inputCadAlunoApenasinput}
                  mask="(00) 00000-0000"
                  name="phone"
                  value={form.phone}
                  placeholder="Telefone"
                  unmask={false}
                  onAccept={(value: string) =>
                    setForm((prev) => ({ ...prev, phone: value }))
                  }
                />

                <IMaskInput
                  className={styles.inputCadAlunoApenasinput}
                  mask="000.000.000-00"
                  name="cpf"
                  value={form.cpf}
                  placeholder="CPF"
                  unmask={false}
                  onAccept={(value: string) =>
                    setForm((prev) => ({ ...prev, cpf: value }))
                  }
                />

                <select
                  className={styles.inputCadAlunoApenasinput}
                  name="funcao"
                  value={form.funcao}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione a função</option>
                  {[
                    "Aluno",
                    "Comum",
                    "Monitor",
                    "Adm",
                    "CmtCia",
                    "CmtCa",
                    "Comando",
                    "Master",
                  ].map((funcao) => (
                    <option key={funcao} value={funcao}>
                      {funcao}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.inputCadAlunoApenasinput}
                  name="orgao"
                  value={form.orgao}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione...</option>
                  <option value="DIM">DIM</option>
                  <option value="1º BPM">1º BPM</option>
                  <option value="6º BPM">6º BPM</option>
                  <option value="11º BPM">11º BPM</option>
                  <option value="12º BPM">12º BPM</option>
                  <option value="13º BPM">13º BPM</option>
                  <option value="16º BPM">16º BPM</option>
                  <option value="17º BPM">17º BPM</option>
                  <option value="18º BPM">18º BPM</option>
                  <option value="19º BPM">19º BPM</option>
                  <option value="20º BPM">20º BPM</option>
                  <option value="25º BPM">25º BPM</option>
                  <option value="26º BPM">26º BPM</option>

                  <option value="DIRESP">DIRESP</option>
                  <option value="CPM">CPM</option>
                  <option value="CIVIL">CIVIL</option>
                </select>

                <input
                  className={styles.inputCadAlunoApenasinput}
                  type="number"
                  name="mat"
                  value={form.mat}
                  placeholder="Matrícula"
                  onChange={handleInputChange}
                />

                <select
                  className={styles.inputCadAlunoApenasinput}
                  name="pg"
                  value={form.pg}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione...</option>
                  <option value="AL">AL</option>
                  <option value="SD">SD</option>
                  <option value="CB">CB</option>
                  <option value="3º SGT">3º SGT</option>
                  <option value="2º SGT">2º SGT</option>
                  <option value="1º SGT">1º SGT</option>
                  <option value="ST">ST</option>
                  <option value="2º TEN">2º TEN</option>
                  <option value="1º TEN">1º TEN</option>
                  <option value="CAP">CAP</option>
                  <option value="MAJ">MAJ</option>
                  <option value="TC">TC</option>
                  <option value="CEL">CEL</option>
                  <option value="CIV">CIV</option>
                </select>

                <input
                  className={styles.inputCadAlunoApenasinput}
                  type="text"
                  name="nomeGuerra"
                  value={form.nomeGuerra}
                  placeholder="Nome de Guerra"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div
              className={styles.botaoFooterCadAluno}
              onClick={() => onSubmit(form)}
            >
              <span>{isEditMode ? "EDITAR" : "SALVAR"}</span>
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
