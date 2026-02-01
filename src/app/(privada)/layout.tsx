"use client"; // Diretriz para o componente ser tratado no cliente

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./privateLayout.module.css";
import Image from "next/image";
import {
  FaAddressCard,
  FaAlignCenter,
  FaBars,
  FaCheckSquare,
  FaComment,
  FaCommentAlt,
  FaHome,
  FaKey,
  FaKeycdn,
  FaQuoteLeft,
  FaQuoteRight,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";

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
  iat: number;
  exp: number;
  aluno?: {
    id: number;
    userId: number;
    resp1: string;
    resp2: string;
    grauInicial: number;
    turmaId: number;
    turma: {
      id: number;
      name: string; // Nome da Turma
      cia: {
        id: number;
        name: string; // Nome da Cia
      };
    };
  };
}

interface Comentario {
  id: number;
  comentario: string;
  createdAt: string; // ou Date se você já fizer parse
  usercomentario: {
    pg?: string;
    nomeGuerra?: string;
    funcao?: string;
    imagemUrl?: string | undefined;
  };
}

const getUserFromCookies = (): User | null => {
  if (typeof window === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userData="));

  if (!cookie) return null;

  try {
    let token = cookie.split("=")[1];

    // Decodifica URL (encodeURIComponent)
    token = decodeURIComponent(token);

    // Decodifica Base64
    const decoded = atob(token);

    // Agora sim parseia o JSON
    const user = JSON.parse(decoded) as User;

    return user;
  } catch (err) {
    console.error("Erro ao parsear userData do cookie:", err);
    return null;
  }
};

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const [comentario, setComentario] = useState<Comentario | null>(null);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    const userData = getUserFromCookies();
    if (userData) {
      setUser(userData);
    } else {
      router.push("/login"); // agora vai redirecionar
    }
  }, [router]);

  //INICIO MODAL USUARIO
  useEffect(() => {
    if (showUserModal) {
      setActiveTab("geral");
    }
  }, [showUserModal]);

  //FIM MODAL USUARIO

  //INICIO METODO PARA DESLOGAR
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        setUser(null);
        setShowUserModal(false);
        router.push("/login");
      } else {
        console.error("Erro ao deslogar");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }
  //FIM METODO PARA DESLOGAR

  //INICIO METODO PARA ALTERAR A SENHA
  const handleChangePassword = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Exibe a mensagem que vem do backend, ou erro genérico
        alert(data.message || data.error || "Erro ao alterar senha");
      } else {
        alert("Senha alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro inesperado ao alterar senha.");
    }
  };
  //FIM METODO PARA ALTERAR A SENHA

  //INICIO METODO PARA COMENTARIO

  useEffect(() => {
    async function fetchComentario() {
      try {
        const res = await fetch("/api/comentario");
        const data = await res.json();

        if (data && !data.error) {
          setComentario(data); // ✅ o backend retorna 1 objeto, não array
        }
      } catch (error) {
        console.error("Erro ao carregar comentário:", error);
      }
    }

    fetchComentario();
  }, []);

  //FIM METODO PARA COMENTARIO

  async function handleEnviarComentario() {
    if (!novoComentario.trim()) {
      alert("Por favor, escreva um comentário antes de enviar.");
      return;
    }

    try {
      const res = await fetch("/api/comentario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario: novoComentario,
          userIdComentario: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Erro ao enviar comentário: " + (data.error || "desconhecido"));
      } else {
        alert("Comentário publicado com sucesso!");
        setShowComentarioModal(false);
        setNovoComentario("");
        setComentario(data); // atualiza o estado local ✅
      }
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Erro ao enviar o comentário. Tente novamente.");
    }
  }

  if (!user) {
    return <div>Você não está autenticado. Redirecionando para o login...</div>;
  }

  return (
    <div className={styles.appContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={28}
            height={28}
          />
          <span className={styles.logoTextPrimeiraParte}>
            <strong>Atos</strong>
          </span>
        </div>
        <div className={styles.headerMenu}>
          <button
            className={styles.headerMenuButton}
            onClick={() => setShowUserModal(true)}
          >
            <div
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {user?.imagemUrl ? (
                <Image
                  width={30}
                  height={30}
                  src={`/${user.imagemUrl.replace(/\\/g, "/")}`}
                  alt={`Foto de Usuario`}
                  className={styles.usuarioImagem}
                />
              ) : (
                <FaUser className={styles.userSemImagem} />
              )}

              <div
                style={{
                  display: "block",
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#000000",
                  fontSize: "10px",
                }}
              >
                <div>
                  {user.pg} {user.nomeGuerra}
                </div>

                <div>{user.funcao}</div>
              </div>
            </div>
          </button>
        </div>
      </header>
      {/* Header */}

      {/* Sidebar + Conteúdo */}
      <div className={styles.dashboardContainer}>
        <div
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
        >
          <button
            className={styles.menuButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <ul className={styles.menuItems}>
            <li
              onClick={() => router.push("/dashboard")}
              style={{ cursor: "pointer" }}
            >
              {/* Ícone com estilo apenas no mobile */}
              <div
                className={`${styles.mobileIconWrapper} ${
                  pathname === "/dashboard" ? styles.active : ""
                }`}
              >
                <FaHome style={{ fontSize: "30px" }} className={styles.icon} />
              </div>

              {/* Ícone padrão para desktop */}
              <FaHome
                style={{ fontSize: "40px", color: "#000000", padding: "5px" }}
                className={`${styles.icon} ${styles.desktopIcon} ${
                  pathname === "/dashboard" ? styles.active : ""
                }`}
              />

              {/* Texto controlado pelo sidebar */}
              {sidebarOpen && <span className={styles.itemText}>Home</span>}

              {/* Texto sempre visível no mobile */}
              <span className={styles.mobileOnlyText}>Home</span>
            </li>

            <li
              onClick={() => router.push("/user")}
              style={{ cursor: "pointer" }}
            >
              {/* Ícone com estilo apenas no mobile */}
              <div
                className={`${styles.mobileIconWrapper} ${
                  pathname === "/user" ? styles.active : ""
                }`}
              >
                <FaUsers style={{ fontSize: "30px" }} className={styles.icon} />
              </div>

              {/* Ícone padrão para desktop */}
              <FaUsers
                style={{ fontSize: "40px", color: "#000000", padding: "5px" }}
                className={`${styles.icon} ${styles.desktopIcon} ${
                  pathname === "/user" ? styles.active : ""
                }`}
              />

              {/* Texto controlado pelo sidebar */}
              {sidebarOpen && <span className={styles.itemText}>Usuarios</span>}

              {/* Texto sempre visível no mobile */}
              <span className={styles.mobileOnlyText}>Usuarios</span>
            </li>
          </ul>

          <div className={styles.sidebarFooter}>
            <div
              className={styles.profileItem}
              onClick={() => setShowUserModal(true)}
              style={{ cursor: "pointer" }}
            >
              {user?.imagemUrl ? (
                <Image
                  width={30}
                  height={30}
                  src={`/${user.imagemUrl.replace(/\\/g, "/")}`}
                  alt={`Foto de Usuario`}
                  className={styles.usuarioImagem}
                />
              ) : (
                <FaUser color="#333333" fontSize={20} />
              )}
              {sidebarOpen && <span className={styles.itemText}> Perfil</span>}
            </div>
          </div>
        </div>

        <main className={styles.conteudoPagina}>{children}</main>
      </div>

      {/* INICIO MODAL PERFIL DO USUARIO */}
      {showUserModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowUserModal(false)}
        >
          <div
            className={styles.userModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalLeft}>
              <ul className={styles.modalMenu}>
                <li
                  className={activeTab === "geral" ? styles.activeMenuItem : ""}
                  onClick={() => setActiveTab("geral")}
                >
                  <FaAlignCenter className={styles.menuIcon} />
                  <span className={styles.geralSenhaPjes}></span>
                </li>
                <li
                  className={activeTab === "senha" ? styles.activeMenuItem : ""}
                  onClick={() => setActiveTab("senha")}
                >
                  <FaKey className={styles.menuIcon} />
                  <span className={styles.geralSenhaPjes}></span>
                </li>
              </ul>
              <div className={styles.modalFooterLeft}>
                <div
                  className={styles.profileFooterItem}
                  onClick={() => setShowUserModal(false)}
                >
                  <FaUser />
                </div>
              </div>
            </div>
            <div className={styles.modalRight}>
              {activeTab === "geral" && user && (
                <div className={styles.divTabGeral}>
                  {/* CONTEÚDO SCROLLÁVEL */}
                  <div className={styles.divTabGeralBotoes}>
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                      <div style={{ marginRight: "10px" }}>
                        {user?.imagemUrl ? (
                          <Image
                            width={60}
                            height={60}
                            src={`/${user.imagemUrl.replace(/\\/g, "/")}`}
                            alt={`Foto de Usuario`}
                            className={styles.usuarioImagemList}
                          />
                        ) : (
                          <FaUser
                            color="#333333"
                            className={styles.imgUserModal}
                          />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", textAlign: "left" }}>
                          <strong>{user.name}</strong>
                        </div>
                        <div style={{ fontSize: "14px", display: "flex" }}>
                          {user.seduc}
                        </div>
                        <div style={{ fontSize: "14px", textAlign: "left" }}>
                          Mat: {user.mat} | {user.orgao}
                        </div>
                      </div>
                    </div>

                    {/* INICIO BOTOES DO ALUNO */}
                    {user?.typeUser === 1 && (
                      <div>
                        <div className={styles.divTabPrincipalBotoes}>
                          {/* INICIO BOTAO MEUS DADOS*/}
                          <div
                            className={styles.divTabBotoes}
                            onClick={() => {
                              setShowUserModal(false); // fecha o modal
                              router.push("/perfil");
                            }}
                          >
                            <FaUser fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>Meus dados</span>
                          </div>
                          {/* FIM BOTAO MEUS DADOS*/}

                          {/* INICIO BOTAO DE COMUNICAÇÃO*/}
                          <div
                            className={styles.divTabBotoes}
                            onClick={() => {
                              setShowUserModal(false); // fecha o modal
                              router.push("/aluno/comunicacao");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FaComment fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>
                              Comunicação
                            </span>
                          </div>
                          {/* FIM BOTAO DE COMUNICAÇÃO*/}
                        </div>

                        <div className={styles.divTabPrincipalBotoes}>
                          {/* BOTAO DE AUTORIZAÇÃO*/}
                          <div
                            className={styles.divTabBotoes}
                            onClick={() => {
                              setShowUserModal(false); // fecha o modal
                              router.push("/aluno/autorizacao");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FaAddressCard fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>
                              Autorização
                            </span>
                          </div>
                          {/* FIM BOTAO DE AUTORIZAÇÃO*/}

                          {/* INICIO BOTAO DISCIPLINAS*/}
                          <div className={styles.divTabBotoes}>
                            <FaFolderClosed fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>
                              Disciplinas
                            </span>
                          </div>
                          {/* FIM BOTAO DISCIPLINAS*/}
                        </div>
                      </div>
                    )}
                    {/* FIM BOTOES DO ALUNO */}

                    {/* INICIO BOTOES DO MONITOR */}
                    {user?.typeUser === 10 && (
                      <div>
                        <div className={styles.divTabPrincipalBotoes}>
                          {/* INICIO BOTAO MEUS DADOS*/}
                          <div
                            className={styles.divTabBotoes}
                            onClick={() => {
                              setShowUserModal(false); // fecha o modal
                              router.push("/perfil");
                            }}
                          >
                            <FaUser fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>Meus dados</span>
                          </div>
                          {/* FIM BOTAO MEUS DADOS*/}

                          {/* INICIO BOTAO ESCALAS*/}
                          <div className={styles.divTabBotoes}>
                            <FaCheckSquare fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>Escalas</span>
                          </div>
                          {/* FIM BOTAO ESCALAS*/}
                        </div>
                      </div>
                    )}
                    {/* FIM BOTOES DO MONITOR */}

                    {/* INICIO BOTOES DO PÁRTICULAR */}
                    {user?.typeUser === 2 && (
                      <div>
                        <div className={styles.divTabPrincipalBotoes}>
                          {/* INICIO BOTAO MEUS DADOS*/}
                          <div
                            className={styles.divTabBotoes}
                            onClick={() => {
                              setShowUserModal(false); // fecha o modal
                              router.push("/perfil");
                            }}
                          >
                            <FaUser fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>Meus dados</span>
                          </div>
                          {/* FIM BOTAO MEUS DADOS*/}

                          {/* INICIO BOTAO AUTORIZAÇÃO DO PARTICULAR*/}
                          <div className={styles.divTabBotoes}>
                            <FaCheckSquare fontSize={20} color="#6d6868" />
                            <span style={{ color: "#6d6868" }}>
                              Autorização
                            </span>
                          </div>
                          {/* FIM BOTAO AUTORIZAÇÃO DO PARTICULAR*/}
                        </div>
                      </div>
                    )}
                    {/* FIM BOTOES DO PÁRTICULAR */}

                    {/* INICIO DIV COMENTARIO*/}
                    <div className={styles.divPrincipalComentario}>
                      <div style={{ fontSize: "30px", color: "#6d6868" }}>
                        <FaQuoteLeft />
                      </div>
                      <label className={styles.labelComentario}>
                        {comentario?.comentario ||
                          "Ainda não há comentários cadastrados."}
                      </label>

                      <label className={styles.labelDataComentario}>
                        {comentario
                          ? new Date(comentario.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            ) +
                            " às " +
                            new Date(comentario.createdAt).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}
                      </label>

                      <div className={styles.divAspasDireita}>
                        <FaQuoteRight />
                      </div>

                      {/* botao comentario */}
                      {[6, 7, 8, 10].includes(user?.typeUser ?? 0) && (
                        <div style={{ textAlign: "left", marginTop: "15px" }}>
                          <div onClick={() => setShowComentarioModal(true)}>
                            <FaCommentAlt color="#2a4a9b4a" fontSize={30} />
                          </div>
                        </div>
                      )}

                      {/* Imagem alinhada à direita */}
                      <div className={styles.divImgComentario}>
                        <div style={{ marginRight: "10px" }}>
                          {user?.imagemUrl ? (
                            <Image
                              width={60}
                              height={60}
                              src={`/${(comentario?.usercomentario?.imagemUrl ?? "").replace(/\\/g, "/")}`}
                              alt={`Foto de Usuario`}
                              className={styles.usuarioImagemList}
                            />
                          ) : (
                            <FaUser
                              color="#333333"
                              className={styles.imgUserModal}
                            />
                          )}
                        </div>

                        <label className={styles.labelNomeUserComentario}>
                          {comentario?.usercomentario?.pg?.toUpperCase()}{" "}
                          {comentario?.usercomentario?.nomeGuerra?.toUpperCase() ||
                            "Usuário Anônimo"}{" "}
                          {comentario?.usercomentario?.funcao?.toUpperCase()}
                        </label>
                      </div>
                    </div>
                    {/* FIM DIV COMENTARIO*/}
                  </div>

                  {/* RODAPÉ FIXO COM O BOTÃO */}
                  <div className={styles.modalFooterLeft}>
                    <div
                      className={styles.profileFooterItem}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className={styles.menuIcon} />
                      <span>Desconectar</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "senha" && (
                <>
                  <div style={{ marginBottom: "1rem" }}>
                    <FaKey className={styles.imgSenhaModal} />
                  </div>

                  {/* Restante dos dados */}
                  <div className={styles.seiFuncaoTelEmail}>
                    <div className={styles.divSeiFuncaoTelEmail}>
                      <FaKeycdn style={{ marginRight: "8px" }} />
                      <input
                        type="password"
                        placeholder="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.divSeiFuncaoTelEmail}>
                      <FaKey className={styles.faSeiFuncaoTelEmail} />
                      <input
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* Linha divisória */}
                  <hr className={styles.hrSeiFuncaoTelEmail} />

                  <div className={styles.modalFooterLeft}>
                    <div
                      className={styles.profileFooterItem}
                      onClick={handleChangePassword}
                    >
                      <FaKey className={styles.menuIcon} />
                      <span>Atualizar Senha</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* FIM MODAL PERFIL DO USUARIO */}

      {/* INÍCIO MODAL NOVO COMENTÁRIO */}
      {showComentarioModal && (
        <div
          onClick={() => setShowComentarioModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              width: "400px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              animation: "slideDown 0.3s ease",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#126a07" }}>
              Novo Comentário
            </h3>

            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Digite seu comentário..."
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                color: "#000000",
                resize: "none",
                outline: "none",
                marginBottom: "10px",
              }}
            />

            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setShowComentarioModal(false)}
                style={{
                  background: "#888",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 15px",
                  marginRight: "8px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleEnviarComentario}
                style={{
                  background: "#126a07",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 15px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FIM MODAL NOVO COMENTÁRIO */}
    </div>
  );
}
