"use client";

import { useState, useEffect } from "react";
import styles from "@/app/(privada)/privateLayout.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: EnderecoInput) => void;
  userId: number;
};

export type EnderecoInput = {
  complement: string;
  numberAddress: number;
  cep: string;
  cityId: number;
  userId: number;
};

type City = {
  id: number;
  name: string;
};

export default function CadastrarEnderecoModal({
  isOpen,
  onClose,
  onSubmit,
  userId,
}: Props) {
  const [form, setForm] = useState<EnderecoInput>({
    cep: "",
    numberAddress: 0,
    complement: "",
    cityId: 0,
    userId,
  });

  const [cidades, setCidades] = useState<City[]>([]);
  const [erroCidade, setErroCidade] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        cep: "",
        numberAddress: 0,
        complement: "",
        cityId: 0,
        userId,
      });

      fetchCidades();
    }
  }, [isOpen, userId]);

  const fetchCidades = async () => {
    try {
      const res = await fetch("/api/city");

      if (!res.ok) {
        const errorData = await res.json();
        setErroCidade(errorData.error || "Erro ao carregar cidades");
        return;
      }

      const data = await res.json();
      setCidades(data);
      setErroCidade(null);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      setErroCidade("Erro ao buscar cidades.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "numberAddress" || name === "cityId" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.cityId) {
      alert("Por favor, selecione uma cidade.");
      return;
    }

    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlayCadEndereco} onClick={onClose}>
      <div
        className={styles.cadEnderecoModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalRightCadAluno}>
          <h3 style={{ fontSize: "15px", paddingBottom: "10px" }}>
            <strong>Adicionar Endereço</strong>
          </h3>

          <div style={{ marginBottom: "1rem" }}>
            <input
              className={styles.inputCadAlunoApenasinput}
              name="complement"
              placeholder="Complemento"
              value={form.complement}
              onChange={handleChange}
            />

            <input
              className={styles.inputCadAlunoApenasinput}
              type="number"
              name="numberAddress"
              placeholder="Número"
              value={form.numberAddress}
              onChange={handleChange}
            />

            <input
              className={styles.inputCadAlunoApenasinput}
              type="text"
              name="cep"
              placeholder="CEP"
              value={form.cep}
              onChange={handleChange}
            />

            <select
              className={styles.inputCadAlunoApenasinput}
              name="cityId"
              value={form.cityId}
              onChange={handleChange}
            >
              <option value="">Selecione a cidade</option>
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.id}>
                  {cidade.name}
                </option>
              ))}
            </select>

            {erroCidade && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {erroCidade}
              </p>
            )}
          </div>

          <div style={{ display: "flex" }}>
            <div
              style={{ marginRight: "5px", fontSize: "15px", padding: "5px" }}
              className={styles.botaoFooterCadAluno}
              onClick={handleSubmit}
            >
              <span>Salvar</span>
            </div>

            <div
              style={{ fontSize: "15px", padding: "5px" }}
              className={styles.botaoFooterCancelar}
              onClick={onClose}
            >
              Cancelar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
