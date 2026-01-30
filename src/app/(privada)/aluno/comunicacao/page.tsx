"use client";

import { useEffect, useState } from "react";
import styles from "../../privateLayout.module.css";
import { useRouter, useSearchParams } from "next/navigation";
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

interface ComunicacaoApi extends Comunicacao {
  userIdAl: number;
}

const ComunicacaoPage = () => {
  const [comunicacao, setComunicacoes] = useState<Comunicacao[]>([]);
  const [filteredComunicacoes, setFilteredComunicacoes] = useState<
    Comunicacao[]
  >([]);
  const [comunicacaoSelecionado, setComunicacaoSelecionado] =
    useState<Comunicacao | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const alunoId = searchParams.get("id");

  useEffect(() => {
    async function fetchComunicacoes() {
      try {
        const url = alunoId
          ? `/api/aluno/comunicacao?id=${alunoId}`
          : "/api/aluno/comunicacao";

        const res = await fetch(url);
        const data: ComunicacaoApi[] = await res.json();

        if (!res.ok) throw new Error("Erro ao buscar comunicações");

        const comunicacoesFiltradas: Comunicacao[] = alunoId
          ? data.filter((com) => com.userIdAl === Number(alunoId))
          : data;

        setComunicacoes(comunicacoesFiltradas);
        setFilteredComunicacoes(comunicacoesFiltradas);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchComunicacoes();
  }, [alunoId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = comunicacao.filter((com) =>
      com.motivo.toLowerCase().includes(value),
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
      if (!res.ok) throw new Error("Erro ao buscar detalhes");

      const detalhe: Comunicacao = await res.json();
      setComunicacaoSelecionado(detalhe);
    } catch (error) {
      console.error(error);
    }
  };
  //FIM ABRIR DETALHES DA COMUNICAÇÃO

  if (loading) {
    return <p>Carregando...</p>;
  }

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
                              "pt-BR",
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
