"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaAngleLeft,
  FaBarcode,
  FaChartLine,
  FaGraduationCap,
  FaMapMarker,
  FaPhone,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import styles from "../privateLayout.module.css";
import Image from "next/image";

export default function PerfilPage() {
  const [userSelecionado, setUserSelecionado] = useState<any>(null);
  const [alunosDependentes, setAlunosDependentes] = useState<any[]>([]);
  const [responsaveisDoAluno, setResponsaveisDoAluno] = useState<any[]>([]);

  const router = useRouter();
  // Busca o ID do usuário logado via cookie e usa esse ID para buscar os dados completos
  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userData="));

    if (!userCookie) return;

    try {
      const userString = userCookie.split("=")[1];
      const userData = JSON.parse(decodeURIComponent(userString));

      if (userData?.id) {
        fetch(`/api/user/${userData.id}`)
          .then((res) => res.json())
          .then((data) => {
            // Inclui iat e exp no objeto do usuário selecionado
            setUserSelecionado({
              ...data,
              iat: userData.iat,
              exp: userData.exp,
            });
          })
          .catch((err) => {
            console.error("Erro ao buscar dados do usuário logado:", err);
          });
      }
    } catch (err) {
      console.error("Erro ao parsear cookie do usuário:", err);
    }
  }, []);

  // Busca alunos/dependentes relacionados a esse usuário
  useEffect(() => {
    if (!userSelecionado?.id) return;

    const fetchDependentes = async () => {
      try {
        const res = await fetch("/api/user");
        const allUsers = await res.json();

        const dependentes = allUsers.filter((u: any) => {
          const aluno = u.aluno;
          return (
            aluno &&
            (aluno.resp1 === userSelecionado.id ||
              aluno.resp2 === userSelecionado.id)
          );
        });

        setAlunosDependentes(dependentes);
      } catch (error) {
        console.error("Erro ao buscar usuários/dependentes:", error);
      }
    };

    fetchDependentes();
  }, [userSelecionado]);

  useEffect(() => {
    if (!userSelecionado?.aluno) return;

    const { resp1, resp2 } = userSelecionado.aluno;

    const fetchResponsaveis = async () => {
      try {
        const res = await fetch("/api/user");
        const allUsers = await res.json();

        const responsaveis = allUsers.filter(
          (u: any) => u.id === resp1 || u.id === resp2
        );

        setResponsaveisDoAluno(responsaveis);
      } catch (error) {
        console.error("Erro ao buscar responsáveis do aluno:", error);
      }
    };

    fetchResponsaveis();
  }, [userSelecionado]);

  return (
    <div style={{ padding: "10px", maxHeight: "800px", overflowY: "auto" }}>
      {userSelecionado ? (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div className={styles.divPrincipalUsuarioPerfil}>
              <div>
                <FaAngleLeft size={30} />
              </div>
              <div className={styles.tituloPerfil}>
                <span>Perfil</span>
              </div>
              <div>
                <FaSearch size={20} />
              </div>
            </div>
          </div>

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
            <div className={styles.itemMenuPerfilSecundaria}>
              <div className={styles.itemMenuPerfilLabel}>Telefone</div>
              <div className={styles.itemMenuPerfilNome}>
                {userSelecionado.phone}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 className={styles.divEnderecoPerfilTitulo}>Meu Endereço</h3>
            </div>

            {userSelecionado?.addresses?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #ccd1d0",
                  paddingBottom: "10px",
                }}
              >
                <div className={styles.itemMenuPerfilIcone}>
                  <FaMapMarker />
                </div>
                <div className={styles.itemMenuPerfilSecundaria}>
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
                    <div>
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

                    <div style={{ marginLeft: "10px", marginRight: "30px" }}>
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
