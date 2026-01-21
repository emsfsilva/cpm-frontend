"use client";

import { useEffect, useState } from "react";
import styles from "../../privateLayout.module.css";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaFilter } from "react-icons/fa";

interface Comunicacao {
  id: number;
  motivo: string;
  grauMotivo: number | null;
  natureza: string | null;
  dataCom: string;
  dataInicio: string;
  horaInicio: string;
  status: string;
}

const ComunicacaoPage = () => {
  const [comunicacao, setComunicacoes] = useState<Comunicacao[]>([]);
  const [filteredComunicacoes, setFilteredComunicacoes] = useState<
    Comunicacao[]
  >([]);
  const [comunicacaoSelecionado, setComunicacaoSelecionado] = useState<
    any | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const alunoId = searchParams.get("id"); // Isso é uma string

  useEffect(() => {
    async function fetchComunicacoes() {
      try {
        const url = alunoId
          ? `/api/aluno/comunicacao?id=${alunoId}`
          : "/api/aluno/comunicacao";

        const res = await fetch(url, {
          method: "GET",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro desconhecido");

        // Se houver um ID de aluno, filtra as comunicações dele
        const comunicacoesFiltradas = alunoId
          ? data.filter((com: any) => com.userIdAl === parseInt(alunoId))
          : data;

        setComunicacoes(comunicacoesFiltradas);
        setFilteredComunicacoes(comunicacoesFiltradas);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComunicacoes();
  }, [alunoId]);

  //INICIO FUNÇÃO DE BUSCAR COMUNICAÇÃO
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = comunicacao.filter((comunicacao) =>
      comunicacao.motivo.toLowerCase().includes(value)
    );
    setFilteredComunicacoes(filtered);
  };
  //FIM FUNÇÃO DE BUSCAR COMUNICAÇÃO

  //INICIO ABRIR DETALHES DA COMUNICAÇÃO
  const handleView = async (id: number) => {
    if (comunicacaoSelecionado?.id === id) {
      setComunicacaoSelecionado(null);
      return;
    }

    try {
      const res = await fetch(`/api/comunicacao/${id}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Erro ao buscar detalhes da comunicacao"
        );
      }

      const comunicacaoDetalhe = await res.json();
      setComunicacaoSelecionado(comunicacaoDetalhe);
    } catch (error) {
      console.error("Erro ao buscar detalhes do comunicacao:", error);
    }
  };
  //FIM ABRIR DETALHES DA COMUNICAÇÃO

  return (
    <div className={styles.alunosContainer}>
      {/* inicio da div da esquerda */}
      <div className={styles.listaEsquerda}>
        <h1 className={styles.tituloListar}>Comunicação</h1>
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <div style={{ width: "90%" }}>
            <input
              className={styles.inputBuscar}
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className={styles.iconeAddUsuario}>
            <FaFilter />
          </div>
        </div>

        {filteredComunicacoes.length > 0 ? (
          filteredComunicacoes.map((comunicacao) => (
            <div
              className={`${styles.listdeAlunos} ${
                comunicacaoSelecionado?.id === comunicacao.id
                  ? styles.alunoSelecionado
                  : ""
              }`}
              key={comunicacao.id}
              onClick={() => {
                handleView(comunicacao.id);
                router.push(`/comunicacao/${comunicacao.id}/tramitacao`);
              }}
            >
              <ul className={styles.itemComunicacao}>
                <li style={{ position: "relative" }}>
                  <div className={styles.comunicacaoAlunoListImg}>
                    <Image
                      src="/assets/images/logo.png"
                      alt="logo"
                      width={40}
                      height={40}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        marginLeft: "5px",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "#807b7b",
                      }}
                    >
                      <h1>
                        <strong>Comunicação</strong>
                      </h1>
                      <span>
                        {comunicacao.dataInicio
                          ? new Date(comunicacao.dataInicio).toLocaleDateString(
                              "pt-BR"
                            )
                          : "Nenhuma data informada"}
                        ,{comunicacao.horaInicio}
                      </span>
                    </div>

                    <div style={{ fontSize: "16px", marginLeft: "5px" }}>
                      <strong>{comunicacao.motivo}</strong> <br></br>
                      {comunicacao.natureza} ({comunicacao.grauMotivo})
                    </div>
                    <div className={styles.divItensMeioUsuario}></div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#0b4bb2",
                        marginLeft: "5px",
                        display: "flex",
                      }}
                    >
                      {comunicacao.status}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          ))
        ) : !error ? (
          <p>Parabens! Vocè não tem Comunicações.</p>
        ) : (
          <p style={{ color: "red" }}>Erro ao buscar Comunicações</p>
        )}
      </div>
      {/* fim da div da esquerda */}
    </div>
  );
};

export default ComunicacaoPage;
