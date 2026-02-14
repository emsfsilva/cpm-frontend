"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBarcode,
  FaChartLine,
  FaGraduationCap,
  FaMapMarker,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import styles from "../privateLayout.module.css";
import Image from "next/image";

// Tipagem das turmas e alunos
interface Turma {
  id: number;
  name: string;
  cia: {
    id: number;
    name: string;
  };
}

interface Aluno {
  id: number;
  grauAtual: number;
  userId: number;
  resp1: number;
  resp2: number;
  turmaId: number;
  turma?: Turma;
}

interface State {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  state: State;
}

interface Address {
  id: number;
  complement?: string;
  numberAddress?: string | number;
  city: City;
  cep?: string;
}

interface User {
  id: number;
  mat?: number;
  name: string;
  pg?: string;
  nomeGuerra?: string;
  funcao?: string;
  phone?: string;
  cpf?: string;
  orgao?: string;
  seduc?: string;
  imagemUrl?: string;
  aluno?: Aluno;
  addresses?: Address[]; // ✅ Adicionado
  iat?: number;
  exp?: number;
}

export default function PerfilPage() {
  const [userSelecionado, setUserSelecionado] = useState<User | null>(null);
  const [alunosDependentes, setAlunosDependentes] = useState<User[]>([]);
  const [responsaveisDoAluno, setResponsaveisDoAluno] = useState<User[]>([]);

  const [editPhone, setEditPhone] = useState(false);
  const [phoneTemp, setPhoneTemp] = useState("");

  const router = useRouter();

  async function handleSavePhone() {
    if (!userSelecionado) return;

    const res = await fetch(`/api/user/${userSelecionado.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneTemp }),
    });

    if (!res.ok) {
      alert("Erro ao atualizar telefone");
      return;
    }

    setUserSelecionado({
      ...userSelecionado,
      phone: phoneTemp,
    });

    setEditPhone(false);
  }

  // Busca o ID do usuário logado via cookie e busca os dados completos
  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userData="));

    if (!userCookie) return;

    try {
      const userString = userCookie.split("=")[1];
      const userData: { id: number; iat?: number; exp?: number } = JSON.parse(
        decodeURIComponent(userString),
      );

      if (userData?.id) {
        fetch(`/api/user/${userData.id}`)
          .then((res) => res.json())
          .then((data: User) => {
            setUserSelecionado({
              ...data,
              iat: userData.iat,
              exp: userData.exp,
            });
          })
          .catch((err: unknown) => {
            if (err instanceof Error) console.error(err.message);
            else console.error("Erro desconhecido ao buscar dados do usuário");
          });
      }
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
      else console.error("Erro desconhecido ao parsear cookie do usuário");
    }
  }, []);

  // Busca alunos/dependentes relacionados a esse usuário
  useEffect(() => {
    if (!userSelecionado?.id) return;

    const fetchDependentes = async () => {
      try {
        const res = await fetch("/api/user");
        const allUsers: User[] = await res.json();

        const dependentes = allUsers.filter((u) => {
          const aluno = u.aluno;
          return (
            aluno &&
            (aluno.resp1 === userSelecionado.id ||
              aluno.resp2 === userSelecionado.id)
          );
        });

        setAlunosDependentes(dependentes);
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
        else console.error("Erro desconhecido ao buscar usuários/dependentes");
      }
    };

    fetchDependentes();
  }, [userSelecionado]);

  // Busca responsáveis do aluno selecionado
  useEffect(() => {
    if (!userSelecionado?.aluno) return;

    const { resp1, resp2 } = userSelecionado.aluno;

    const fetchResponsaveis = async () => {
      try {
        const res = await fetch("/api/user");
        const allUsers: User[] = await res.json();

        const responsaveis = allUsers.filter(
          (u) => u.id === resp1 || u.id === resp2,
        );

        setResponsaveisDoAluno(responsaveis);
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
        else console.error("Erro desconhecido ao buscar responsáveis do aluno");
      }
    };

    fetchResponsaveis();
  }, [userSelecionado]);

  return (
    <div style={{ padding: "10px", maxHeight: "800px", overflowY: "auto" }}>
      {userSelecionado ? (
        <>
          <div style={{ marginBottom: "20px" }}></div>

          {/* nome comeplto */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaUser />
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Nome Completo</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.name}
              </div>
            </div>
          </div>

          {/* nome nomeGuerra */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaUser />
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Nome Guerra</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.nomeGuerra}
              </div>
            </div>
          </div>

          {/* nome post/graducacao */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaUser />
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>
                Posto ou Graducação
              </div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.pg}
              </div>
            </div>
          </div>

          {/* nome funcao */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaChartLine />
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Função</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.funcao}
              </div>
            </div>
          </div>

          {/* nome matricula */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaBarcode />
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Matricula</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.mat}
              </div>
            </div>
          </div>

          {/* seduc */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaUser />
            </div>
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Login Seduc</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.seduc}
              </div>
            </div>
          </div>

          {/* telefone */}
          <div className={styles.itemMenuPerfilPrincipal}>
            <div className={styles.itemMenuPerfilIcone}>
              <FaPhone />
            </div>
            <div
              style={{ width: "100%" }}
              className={styles.itemMenuPerfilSecundaria}
            >
              <div className={styles.itemMenuPerfilLabel}>
                Telefone (WhatsApp)
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: "10px",
                }}
              >
                {!editPhone ? (
                  <>
                    <div className={styles.itemMenuPerfilNome}>
                      {userSelecionado.phone}
                    </div>

                    <span
                      className={styles.divGrupoBotaoDependentes}
                      onClick={() => {
                        setPhoneTemp(userSelecionado.phone || "");
                        setEditPhone(true);
                      }}
                      style={{
                        background: "#0ea860",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "15px",
                        fontSize: "9px",
                        textAlign: "center",
                        width: "50px",
                        marginLeft: "auto",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      value={phoneTemp}
                      onChange={(e) => setPhoneTemp(e.target.value)}
                      style={{ flex: 1, padding: "5px" }}
                    />

                    <span
                      onClick={handleSavePhone}
                      style={{
                        background: "#0ea860",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "10px",
                        fontSize: "9px",
                        cursor: "pointer",
                      }}
                    >
                      Salvar
                    </span>

                    <span
                      onClick={() => setEditPhone(false)}
                      style={{
                        background: "#ccc",
                        padding: "5px",
                        borderRadius: "10px",
                        fontSize: "9px",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 className={styles.divEnderecoPerfilTitulo}>Meu Endereço</h3>
            </div>

            {/* Pega o primeiro endereço de forma segura */}
            {userSelecionado?.addresses?.[0] ? (
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #ccd1d0",
                  paddingBottom: "10px",
                }}
              >
                <div className={styles.itemMenuPerfilIcone}>
                  <FaMapMarker
                    onClick={() => {}}
                    style={{
                      color: "#737675",
                      marginLeft: "auto",
                      fontSize: "23px",
                    }}
                  />
                </div>
                <div
                  style={{ fontFamily: "auto" }}
                  className={styles.itemMenuPerfilSecundaria}
                >
                  {userSelecionado.addresses[0].complement}, Nº{" "}
                  {userSelecionado.addresses[0].numberAddress} -{" "}
                  {userSelecionado.addresses[0].city.name},{" "}
                  {userSelecionado.addresses[0].city.state.name}, CEP:{" "}
                  {userSelecionado.addresses[0].cep}
                </div>
              </div>
            ) : (
              <div>Endereço não cadastrado.</div>
            )}
          </div>

          {/* Apenas para alunos */}
          {userSelecionado?.aluno && (
            <div
              style={{ paddingTop: "20px", borderBottom: "1px solid #ccd1d0" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 className={styles.divEnderecoPerfilTitulo}>
                  Dados Acadêmicos
                </h3>
              </div>

              {/* turma */}
              <div className={styles.itemMenuPerfilPrincipal}>
                <div className={styles.itemMenuPerfilIcone}>
                  <FaGraduationCap />
                </div>
                <div className={styles.itemMenuPerfilSecundaria}>
                  <div className={styles.itemMenuPerfilLabel}>
                    Turma e Companhia
                  </div>
                  <div className={styles.itemMenuPerfilNome}>
                    {userSelecionado.aluno.turma?.name} |{" "}
                    {userSelecionado.aluno.turma?.cia?.name}
                  </div>
                </div>
                <div className={styles.divDadosAcademicosPrincipal}>
                  <span className={styles.spanDadosAcademicosTurma}>
                    Minha Turma
                  </span>
                </div>
              </div>

              {/* grauAtual */}
              <div className={styles.itemMenuPerfilPrincipal}>
                <div className={styles.itemMenuPerfilIcone}>
                  <FaChartLine />
                </div>
                <div className={styles.itemMenuPerfilSecundaria}>
                  <div className={styles.itemMenuPerfilLabel}>Grau Atual</div>
                  <div className={styles.itemMenuPerfilNome}>
                    {userSelecionado.aluno.grauAtual}
                  </div>
                </div>
                <div className={styles.divDadosAcademicosPrincipal}>
                  <span className={styles.spanDadosAcademicosComunicacao}>
                    Comunicações
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Apenas para alunos */}

          {/* dados dos dependentes */}
          {alunosDependentes.length > 0 && (
            <div style={{ paddingTop: "20px" }}>
              <h3 className={styles.divEnderecoPerfilTitulo}>
                Meus Dependentes
              </h3>
              {alunosDependentes.map((dep, idx) => (
                <div key={idx}>
                  <div className={styles.divimgDependentesPrincipal}>
                    <div style={{ width: "15%" }}>
                      {dep.imagemUrl ? (
                        <Image
                          width={40}
                          height={40}
                          src={`/${dep.imagemUrl.replace(/\\/g, "/")}`}
                          alt="Foto do usuário"
                          className={styles.imagemUsuarioPerfilDependente}
                        />
                      ) : (
                        <FaUser className={styles.imagemUsuario} />
                      )}
                    </div>

                    <div
                      style={{
                        width: "30%",
                        marginLeft: "10px",
                        marginRight: "30px",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {dep.pg} {dep.nomeGuerra}
                      </div>

                      <div style={{ fontSize: "13px", color: "#606060" }}>
                        {dep.seduc}
                      </div>
                      <div style={{ fontSize: "11px", color: "#606060" }}>
                        Turma: {dep.aluno?.turma?.name || "N/A"} |{" "}
                        {dep.aluno?.turma?.cia?.name || "N/A"}
                      </div>
                    </div>

                    <div
                      style={{
                        width: "55%",
                        textAlign: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className={styles.divGrupoBotaoDependentes}
                        onClick={() => {
                          router.push(`/aluno/comunicacao?id=${dep.id}`);
                        }}
                        style={{
                          background: "#0ea860",
                          color: "#ffffff",
                          padding: "10px",
                          borderRadius: "15px",
                          fontSize: "11px",
                          marginRight: "5px",
                        }}
                      >
                        Comunicação
                      </span>

                      <span
                        className={styles.divGrupoBotaoDependentes}
                        onClick={() => {
                          if (!dep.aluno?.userId) return;
                          router.push(
                            `/aluno/autorizacao/dependente?userId=${dep.aluno.userId}`,
                          );
                        }}
                        style={{
                          background: "#0e44a8",
                          color: "#ffffff",
                          padding: "10px",
                          borderRadius: "15px",
                          fontSize: "11px",
                        }}
                      >
                        Autorizações
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* dados dos responsáveis, se o usuário for aluno */}
          {responsaveisDoAluno.length > 0 && (
            <div style={{ paddingTop: "20px", paddingBottom: "50px" }}>
              <h3 className={styles.divEnderecoPerfilTitulo}>
                Meus Responsáveis
              </h3>

              {responsaveisDoAluno.map((resp, idx) => (
                <div key={idx} className={styles.divimgResponsaveisPrincipal}>
                  <div>
                    {resp.imagemUrl ? (
                      <Image
                        width={40}
                        height={40}
                        src={`/${resp.imagemUrl.replace(/\\/g, "/")}`}
                        alt="Foto do usuário"
                        className={styles.imagemUsuarioPerfilDependente}
                      />
                    ) : (
                      <FaUser
                        className={styles.semImagemUsuarioPerfilDependente}
                      />
                    )}
                  </div>

                  <div style={{ marginLeft: "10px", marginRight: "30px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {resp.pg} {resp.nomeGuerra}
                    </div>

                    <div style={{ fontSize: "13px", color: "#606060" }}>
                      {resp.seduc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>Carregando dados do usuário...</div>
      )}
    </div>
  );
}
