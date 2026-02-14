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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
                  <option value="1º BIESP">1º BIESP</option>
                  <option value="2º BIESP">2º BIESP</option>
                  <option value="BPCHOQUE">BPCHOQUE</option>
                  <option value="BEPI">BEPI</option>
                  <option value="BOPE">BOPE</option>
                  <option value="BPGD">BPGD</option>
                  <option value="BPRP">BPRP</option>
                  <option value="BPRV">BPRV</option>
                  <option value="BPTRAN">BPTRAN</option>
                  <option value="BPTUR">BPTUR</option>
                  <option value="CIPCAES">CIPCAES</option>
                  <option value="CIPMOTO">CIPMOTO</option>
                  <option value="BPA">BPA</option>
                  <option value="RPMON">RPMON</option>
                  <option value="DINTER 1">DINTER 1</option>
                  <option value="2º BPM">2º BPM</option>
                  <option value="4º BPM">4º BPM</option>
                  <option value="9º BPM">9º BPM</option>
                  <option value="10º BPM">10º BPM</option>
                  <option value="15º BPM">15º BPM</option>
                  <option value="21º BPM">21º BPM</option>
                  <option value="22º BPM">22º BPM</option>
                  <option value="24º BPM">24º BPM</option>
                  <option value="27º BPM">27º BPM</option>
                  <option value="5ª CIPM">5ª CIPM</option>
                  <option value="6ª CIPM">6ª CIPM</option>
                  <option value="8ª CIPM">8ª CIPM</option>
                  <option value="10ª CIPM">10ª CIPM</option>
                  <option value="11ª CIPM">11ª CIPM</option>
                  <option value="DINTER 2">DINTER 2</option>
                  <option value="3º BPM">3º BPM</option>
                  <option value="5º BPM">5º BPM</option>
                  <option value="7º BPM">7º BPM</option>
                  <option value="8º BPM">8º BPM</option>
                  <option value="14º BPM">14º BPM</option>
                  <option value="23º BPM">23º BPM</option>
                  <option value="1ª CIPM">1ª CIPM</option>
                  <option value="2ª CIPM">2ª CIPM</option>
                  <option value="4ª CIPM">4ª CIPM</option>
                  <option value="7ª CIPM">7ª CIPM</option>
                  <option value="9ª CIPM">9ª CIPM</option>
                  <option value="2ª EMG">2ª EMG</option>
                  <option value="DPO">DPO</option>
                  <option value="OE">OE</option>
                  <option value="ACG">ACG</option>
                  <option value="AECI">AECI</option>
                  <option value="AG">AG</option>
                  <option value="APMP">APMP</option>
                  <option value="CFARM">CFARM</option>
                  <option value="CODONTO">CODONTO</option>
                  <option value="CEFD">CEFD</option>
                  <option value="CFAP">CFAP</option>
                  <option value="CIMUS">CIMUS</option>
                  <option value="CMH">CMH</option>
                  <option value="COPOM">COPOM</option>
                  <option value="CPM">CPM</option>
                  <option value="CPO">CPO</option>
                  <option value="CPP">CPP</option>
                  <option value="CREED">CREED</option>
                  <option value="CRESEP">CRESEP</option>
                  <option value="CSMINT">CSMINT</option>
                  <option value="CSMMB">CSMMMB</option>
                  <option value="CSMMOTO">CSMMOTO</option>
                  <option value="CTT">CTT</option>
                  <option value="DAL">DAL</option>
                  <option value="DAS">DAS</option>
                  <option value="DASIS">DASIS</option>
                  <option value="DEAJA">DEAJA</option>
                  <option value="DEIP">DEIP</option>
                  <option value="DF">DF</option>
                  <option value="DGA">DGA</option>
                  <option value="DGP">DGP</option>
                  <option value="DVP">DVP</option>
                  <option value="DPJM">DPJM</option>
                  <option value="DS">DS</option>
                  <option value="DTEC">DTEC</option>
                  <option value="EMG">EMG</option>
                  <option value="DASDH">DASDH</option>
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
