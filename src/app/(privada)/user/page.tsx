// app/(privada)/user/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../privateLayout.module.css";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

import {
  FaAddressCard,
  FaBarcode,
  FaComment,
  FaEdit,
  FaEllipsisV,
  FaKey,
  FaPhone,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import CadastrarUsuarioModal from "@/components/CadastrarUsuarioModal";
import ComunicacaoModal from "@/components/ComunicacaoModal";
import CadastrarEnderecoModal, {
  EnderecoInput,
} from "@/components/CadastrarEnderecoModal";
import CadastrarAlunoModal from "@/components/CadastrarAlunoModal";
import type { Aluno } from "@/components/CadastrarAlunoModal";
import AutorizacaoModal from "@/components/AutorizacaoModal";

type Endereco = {
  complement: string;
  numberAddress: number;
  cep: string;
  city: {
    id: number;
    name: string;
    state?: {
      id: number;
      name: string;
    };
  };
};

type User = {
  id: number;
  imagemUrl: string;
  imagemPerfil: string;
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

  aluno?: {
    id: number;
    turma?: {
      id: number;
      name: string;
      cia?: { id: number; name: string };
    };
    resp1?: User; // ou null
    resp2?: User;
    grauInicial?: number;
    grauAtual?: number;
    responsavel1?: User;
    responsavel2?: User;
  };

  addresses?: Endereco[];
};

interface UserLogin {
  id: number;
  name: string;
  typeUser: number;
}

interface AutorizacaoInput {
  [key: string]: unknown;
}

type UserAlvo = {
  id: number;
  imagemUrl?: string | null;
  pg?: string;
  orgao?: string;
  nomeGuerra?: string;
  aluno?: {
    turma?: {
      name: string;
      cia: {
        name: string;
      };
    };
  };
};

const UsuariosPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userLogin, setUserLogin] = useState<UserLogin | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtroFuncao, setFiltroFuncao] = useState<string>("Todos");
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<User | null>(null);

  const [modalComunicacaoAberta, setModalComunicacaoAberta] = useState(false);
  const [modalAutorizacaoAberta, setModalAutorizacaoAberta] = useState(false);
  const [userSelecionado, setUserSelecionado] = useState<User | null>(null);
  const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);

  const [modalAlunoAberto, setModalAlunoAberto] = useState(false);
  const [alunoData, setAlunoData] = useState<Aluno | null>(null);

  const [mostrarMenuModal, setMostrarMenuModal] = useState(false);
  const [userMenuSelecionado, setUserMenuSelecionado] = useState<User | null>(
    null,
  );

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/user");
        const data: User[] = await res.json();

        if (!res.ok) throw new Error("Erro ao buscar usuários");

        setUsers(data);
        setFilteredUsers(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // 👇 Este aqui fecha o menu suspenso ao clicar fora
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbertoId(null);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  // 👇 Este aqui carrega os dados do usuário logado do cookie
  useEffect(() => {
    const userLoginData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userData="))
      ?.split("=")[1];

    if (userLoginData) {
      const decoded = decodeURIComponent(userLoginData);
      try {
        const user = JSON.parse(decoded);
        setUserLogin(user);
      } catch (error) {
        console.error("Erro ao ler userData:", error);
      }
    }
  }, []);

  // ✅👇 ESTE É O NOVO: atualiza os usuários filtrados com base na busca
  useEffect(() => {
    const termoBusca = searchTerm.toLowerCase();

    const filtrados = users.filter((user) => {
      const nomeMatch =
        user.name.toLowerCase().includes(termoBusca) ||
        user.pg.toLowerCase().includes(termoBusca) ||
        user.orgao.toLowerCase().includes(termoBusca) ||
        user.seduc.toLowerCase().includes(termoBusca);

      const funcaoMatch =
        filtroFuncao === "Todos"
          ? true
          : filtroFuncao === "Turmas"
            ? !!user.aluno?.turma
            : user.funcao === filtroFuncao;

      return nomeMatch && funcaoMatch;
    });

    setFilteredUsers(filtrados);
  }, [searchTerm, filtroFuncao, users]);

  //INICIO FUNÇÃO DE BUSCAR USUARIO
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  //FIM FUNÇÃO DE BUSCAR USUARIO

  //INICIO ABRIR DETALHES DO USUARIO
  const handleView = async (id: number) => {
    if (userSelecionado?.id === id) {
      setUserSelecionado(null);
      return;
    }

    try {
      const res = await fetch(`/api/user/${id}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Erro ao buscar detalhes do usuário",
        );
      }

      const userDetalhe = await res.json();
      setUserSelecionado(userDetalhe);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
    }
  };
  //FIM ABRIR DETALHES DO USUARIO

  //INICIO CADASTRAR ENERECO DO USUARIO
  const handleCadastrarEndereco = async (dados: EnderecoInput) => {
    if (!userSelecionado) return;

    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const novoEndereco = await res.json();

      setUserSelecionado((prev) =>
        prev
          ? {
              ...prev,
              addresses: [...(prev.addresses ?? []), novoEndereco],
            }
          : prev,
      );

      toast.success("Endereço cadastrado");
      setModalEnderecoAberto(false);
    } catch {
      toast.error("Erro ao cadastrar endereço");
    }
  };

  //INICIO CADASTRAR ENERECO DO USUARIO

  //INICIO FUNÇÃO EXCLUIR
  const handleDelete = async (userId: number) => {
    const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(
          `Erro ao excluir usuário: ${result?.error || "Erro desconhecido"}`,
        );
        return;
      }

      // Atualiza os usuários locais
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== userId));

      if (userSelecionado?.id === userId) {
        setUserSelecionado(null);
      }

      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro interno ao excluir usuário.");
    }
  };
  //FIM FUNÇÃO EXCLUIR

  //INICIO REDEFINIR SENHA
  const handleResetPassword = async (userId: number) => {
    const confirmar = confirm(
      "Deseja realmente redefinir a senha deste usuário?",
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/user/${userId}/reset-password`, {
        method: "PATCH",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(`Erro: ${result?.error || "Erro ao redefinir senha"}`);
        return;
      }

      toast.success("Senha redefinida com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro interno ao redefinir a senha.");
    }
  };
  //FIM REDEFINIR SENHA

  //INICIO MODAL COMUNICAÇÃO
  const abrirModalComunicacao = (user: User) => {
    setUserSelecionado(user);
    setModalComunicacaoAberta(true);
  };

  const enviarComunicacao = async (dados: {
    motivo: string;
    descricaoMotivo: string;
    userIdAl: number;
  }) => {
    try {
      const userIdCom = userLogin?.id; // quem está enviando
      await axios.post(`/api/comunicacao/criar?userIdCom=${userIdCom}`, dados);
      alert("Comunicação cadastrada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar comunicação.");
    }
  };
  //FIM MODAL COMUNICAÇÃO

  //INICIO MODAL AUTORIZACAO
  const abrirModalAutorizacao = (user: User) => {
    setUserSelecionado(user);
    setModalAutorizacaoAberta(true);
  };

  const enviarAutorizacao = async (dados: AutorizacaoInput) => {
    if (!userLogin) return;

    await axios.post(`/api/autorizacao/criar?userIdAut=${userLogin.id}`, dados);
  };

  //FIM MODAL AUTORIZACAO

  const alunosDependentes = users.filter(
    (u) =>
      u.aluno &&
      (u.aluno.resp1 === userSelecionado?.id ||
        u.aluno.resp2 === userSelecionado?.id),
  );

  //INICIO ABRIR MODAL CADASTRAR USUARIO
  function abrirCadastro() {
    setModalData(null);
    setMostrarModal(true);
  }
  //FIM ABRIR MODAL CADASTRAR USUARIO

  function toUserAlvo(user: User | null): UserAlvo | null {
    if (!user) return null;

    return {
      id: user.id,
      imagemUrl: user.imagemUrl ?? null,
      pg: user.pg,
      orgao: user.orgao,
      nomeGuerra: user.nomeGuerra,
      aluno: user.aluno?.turma
        ? {
            turma: {
              name: user.aluno.turma.name,
              cia: user.aluno.turma.cia
                ? { name: user.aluno.turma.cia.name }
                : { name: "" }, // garante estrutura
            },
          }
        : undefined,
    };
  }

  const userAlvo = toUserAlvo(userSelecionado);

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className={styles.alunosContainer}>
      {/* inicio da div da esquerda */}
      <div className={styles.listaEsquerda}>
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <div style={{ width: "90%" }}>
            <input
              className={styles.inputBuscar}
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {userLogin?.typeUser === 10 && (
            <div className={styles.iconeAddUsuario} onClick={abrirCadastro}>
              <FaPlus />
            </div>
          )}
        </div>

        <div className={styles.divUsuarios}>
          <div className={styles.divFiltroUsuarios}>
            {["Todos", "Aluno", "Monitor"].map((label) => (
              <span
                key={label}
                className={`${styles.spanFiltroUsuarios} ${
                  filtroFuncao === label ? styles.filtroAtivo : ""
                }`}
                onClick={() => setFiltroFuncao(label)}
              >
                {label}
              </span>
            ))}
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`${styles.listdeAlunos} ${
                  userSelecionado?.id === user.id ? styles.alunoSelecionado : ""
                }`}
                onClick={() => handleView(user.id)}
              >
                <ul className={styles.itemAluno}>
                  <li style={{ position: "relative" }}>
                    <div className={styles.alunoListImg}>
                      {user?.imagemUrl ? (
                        <Image
                          width={40}
                          height={40}
                          src={`/${user.imagemUrl.replace(/\\/g, "/")}`}
                          alt="Foto de Usuario"
                          className={styles.usuarioImagemList}
                        />
                      ) : (
                        <FaUser className={styles.alunoSemImagem} />
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: "10px" }}>
                        <strong>
                          {user.pg} {user.nomeGuerra} {user.aluno?.turma?.name}{" "}
                          {user.aluno?.turma?.cia?.name}
                        </strong>
                      </div>
                      <div className={styles.divItensMeioUsuario}>
                        <div className={styles.divItensMeioUsuarioTelefone}>
                          <FaPhone />{" "}
                          <span style={{ marginLeft: "5px" }}>
                            {user.phone}
                          </span>
                        </div>

                        <div className={styles.divItensMeioUsuarioMat}>
                          <FaBarcode />{" "}
                          <span style={{ marginLeft: "5px" }}>{user.mat}</span>
                        </div>

                        <div className={styles.divItensMeioUsuarioFuncao}>
                          <FaUser />{" "}
                          <span style={{ marginLeft: "5px" }}>
                            {user.funcao}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#135886",
                          }}
                        >
                          {user.seduc} | {user.orgao}
                        </span>
                      </div>
                    </div>

                    {/* início menu opções */}
                    {
                      // 👉 Se for typeUser 1, só mostra o menu no próprio usuário
                      ((userLogin?.typeUser === 1 &&
                        userLogin.id === user.id) ||
                        // 👉 Caso contrário, mostra para todos os outros tipos de usuário (ex: 10, 5, 3, etc.)
                        userLogin?.typeUser !== 1) && (
                        <div>
                          <FaEllipsisV
                            className={styles.editIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserMenuSelecionado(user);
                              setMostrarMenuModal(true);
                            }}
                          />

                          {/* 👈 aqui você coloca o dropdown */}
                          {menuAbertoId === user.id && (
                            <div className={styles.dropdownMenu}>
                              <button>Editar</button>
                              <button onClick={() => handleDelete(user.id)}>
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    }
                    {/* fim menu opções */}
                  </li>
                </ul>
              </div>
            ))
          ) : !error ? (
            <p>Não existem Usuários cadastrados</p>
          ) : (
            <p style={{ color: "red" }}>Erro ao buscar Usuários</p>
          )}
        </div>
      </div>
      {/* fim da div da esquerda */}
      {/* inicio da div da direita */}
      <div className={styles.detalhesDesktop}>
        <div style={{ width: "100%" }}>
          {userSelecionado ? (
            <div>
              {/* Cabeçalho com foto e nome */}
              <div className={styles.divHeaderUserDetalhe}>
                <div>
                  {userSelecionado.imagemUrl ? (
                    <Image
                      width={40}
                      height={40}
                      src={`/${userSelecionado.imagemUrl.replace(/\\/g, "/")}`}
                      alt={`Foto de Usuario`}
                      className={styles.usuarioImagemDetalhe}
                    />
                  ) : (
                    <FaUser className={styles.usuarioSemImagemDetalhe} />
                  )}
                </div>

                <div style={{ marginLeft: "5px" }}>
                  <span>
                    <strong>
                      {userSelecionado.pg} {userSelecionado.nomeGuerra}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className={styles.profileDetails}>
                <div style={{ padding: "10px", border: "1px solid #d4d0d0" }}>
                  <div className={styles.divDadosBasicosUserPrincipal}>
                    <div style={{ fontWeight: "bold" }}>Dados Basicos:</div>
                    <button>
                      <FaEdit />
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* nome completo */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Nome Completo:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {userSelecionado.name}
                      </div>
                    </div>

                    {/* login seduc */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Login Seduc:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {userSelecionado.seduc}
                      </div>
                    </div>

                    {/* CPF */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>CPF:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {userSelecionado.cpf}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* nome completo */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Matricula:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {userSelecionado.mat}
                      </div>
                    </div>

                    {/* login seduc */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Telefone:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {userSelecionado.phone}
                      </div>
                    </div>

                    {/* CPF */}
                    <div style={{ flex: 1, padding: "5px" }}>
                      <label style={{ fontSize: "12px" }}>Orgão:</label>
                      <div className={styles.divDadosBasicosUserTexto}>
                        {userSelecionado.orgao}
                      </div>
                    </div>
                  </div>
                </div>

                <ul style={{ marginTop: "15px" }}>
                  {/* Endereços, se existirem */}
                  {userSelecionado.addresses?.length ? (
                    <div
                      style={{ padding: "10px", border: "1px solid #d4d0d0" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{ fontWeight: "bold" }}>
                          Endereço do Usuário:
                        </div>
                        <button onClick={() => setModalEnderecoAberto(true)}>
                          <FaEdit />
                        </button>
                      </div>

                      {userSelecionado.addresses?.map((endereco, index) => (
                        <div
                          key={index}
                          style={{ marginLeft: "10px", marginBottom: "10px" }}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            {endereco.complement} - {endereco.numberAddress}
                          </div>
                          <div>
                            {endereco.city.name}, {endereco.city.state?.name},
                            CEP: {endereco.cep}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.divDadosBasicosUserPrincipal}>
                      <div style={{ fontWeight: "bold" }}>
                        Cadastrar Endereço:
                      </div>
                      <button onClick={() => setModalEnderecoAberto(true)}>
                        <FaEdit />
                      </button>
                    </div>
                  )}

                  {/* Dados de Aluno */}
                  {userSelecionado.aluno ? (
                    <>
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "10px",
                          border: "1px solid #d4d0d0",
                        }}
                      >
                        <div className={styles.divDadosBasicosUserPrincipal}>
                          <div style={{ fontWeight: "bold" }}>
                            Dados do Aluno:
                          </div>
                          {/* Editar dados basicos do aluno */}
                          <button
                            onClick={() => {
                              if (userSelecionado?.aluno) {
                                const aluno: Aluno = {
                                  id: userSelecionado.aluno?.id ?? 0, // ou undefined se for opcional
                                  grauInicial: (
                                    userSelecionado.aluno?.grauInicial ?? 0
                                  ).toString(),
                                  grauAtual: (
                                    userSelecionado.aluno?.grauAtual ?? 0
                                  ).toString(),
                                  turma: {
                                    id: userSelecionado.aluno?.turma?.id ?? 0,
                                    name:
                                      userSelecionado.aluno?.turma?.name ?? "",
                                    cia: {
                                      id:
                                        userSelecionado.aluno?.turma?.cia?.id ??
                                        0,
                                      name:
                                        userSelecionado.aluno?.turma?.cia
                                          ?.name ?? "",
                                    },
                                  },
                                };

                                setAlunoData(aluno);
                                setModalAlunoAberto(true);
                              }
                            }}
                          >
                            <FaEdit />
                          </button>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          {/* grau inicial */}
                          <div style={{ flex: 1, padding: "5px" }}>
                            <label style={{ fontSize: "12px" }}>
                              Grau Inicial:
                            </label>
                            <div className={styles.divDadosBasicosUserTexto}>
                              {userSelecionado.aluno.grauInicial}
                            </div>
                          </div>

                          {/* grau atual */}
                          <div style={{ flex: 1, padding: "5px" }}>
                            <label style={{ fontSize: "12px" }}>
                              Grau Atual:
                            </label>
                            <div className={styles.divDadosBasicosUserTexto}>
                              {userSelecionado.aluno.grauAtual}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          {/* cia */}
                          <div style={{ flex: 1, padding: "5px" }}>
                            <label style={{ fontSize: "12px" }}>
                              Compainha:
                            </label>
                            <div className={styles.divDadosBasicosUserTexto}>
                              {userSelecionado?.aluno?.turma?.cia?.name}
                            </div>
                          </div>

                          {/* turma */}
                          <div style={{ flex: 1, padding: "5px" }}>
                            <label style={{ fontSize: "12px" }}>Turma:</label>
                            <div className={styles.divDadosBasicosUserTexto}>
                              {userSelecionado?.aluno?.turma?.name}
                            </div>
                          </div>
                        </div>

                        {/* Responsáveis */}
                        {userSelecionado.aluno.responsavel1 && (
                          <>
                            <div style={{ display: "flex", gap: "10px" }}>
                              {/* Responsavel 1 */}
                              <div style={{ flex: 1, padding: "5px" }}>
                                <label style={{ fontSize: "12px" }}>
                                  Responsavel pelo Aluno:
                                </label>
                                <div
                                  className={styles.divDadosBasicosUserTexto}
                                >
                                  {userSelecionado.aluno.responsavel1.pg}{" "}
                                  {userSelecionado.aluno.responsavel1.name}
                                </div>
                              </div>

                              {/* telefone do Responsavel 1 */}
                              <div style={{ flex: 1, padding: "5px" }}>
                                <label style={{ fontSize: "12px" }}>
                                  Telefone:
                                </label>
                                <div
                                  className={styles.divDadosBasicosUserTexto}
                                >
                                  {userSelecionado.aluno.responsavel1.phone}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {userSelecionado.aluno.responsavel2 && (
                          <>
                            <div style={{ display: "flex", gap: "10px" }}>
                              {/* Responsavel 2 */}
                              <div style={{ flex: 1, padding: "5px" }}>
                                <label style={{ fontSize: "12px" }}>
                                  Responsavel pelo Aluno:
                                </label>
                                <div
                                  className={styles.divDadosBasicosUserTexto}
                                >
                                  {userSelecionado.aluno.responsavel2.pg}{" "}
                                  {userSelecionado.aluno.responsavel2.name}
                                </div>
                              </div>

                              {/* telefone do Responsavel 1 */}
                              <div style={{ flex: 1, padding: "5px" }}>
                                <label style={{ fontSize: "12px" }}>
                                  Telefone:
                                </label>
                                <div
                                  className={styles.divDadosBasicosUserTexto}
                                >
                                  {userSelecionado.aluno.responsavel2.phone}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : //Se não for aluno, mostra o usuario com seus dependentes
                  alunosDependentes.length > 0 ? (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "10px",
                        border: "1px solid #d4d0d0",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Meus Dependentes:
                      </div>
                      {alunosDependentes.map((alunoUser: User) => (
                        <div key={alunoUser.id}>
                          <ul className={styles.itemAluno}>
                            <li style={{ position: "relative" }}>
                              <div className={styles.alunoListImg}>
                                {alunoUser?.imagemUrl ? (
                                  <Image
                                    width={60}
                                    height={60}
                                    src={`/${alunoUser.imagemUrl.replace(
                                      /\\/g,
                                      "/",
                                    )}`}
                                    alt={`Foto de Usuario`}
                                    className={styles.usuarioImagemList}
                                  />
                                ) : (
                                  <FaUser className={styles.alunoSemImagem} />
                                )}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "14px" }}>
                                  <strong>
                                    {alunoUser.pg} {alunoUser.nomeGuerra}{" "}
                                    {alunoUser.aluno?.turma?.name}{" "}
                                    {alunoUser.aluno?.turma?.cia?.name}
                                  </strong>
                                </div>
                                <div className={styles.divItensMeioUsuario}>
                                  <div
                                    className={
                                      styles.divItensMeioUsuarioTelefone
                                    }
                                  >
                                    <FaPhone />{" "}
                                    <span style={{ marginLeft: "5px" }}>
                                      {alunoUser.phone}
                                    </span>
                                  </div>

                                  <div
                                    className={styles.divItensMeioUsuarioMat}
                                  >
                                    <FaBarcode />{" "}
                                    <span style={{ marginLeft: "5px" }}>
                                      {alunoUser.mat}
                                    </span>
                                  </div>

                                  <div
                                    className={styles.divItensMeioUsuarioFuncao}
                                  >
                                    <FaUser />{" "}
                                    <span style={{ marginLeft: "5px" }}>
                                      {alunoUser.funcao}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{ fontSize: "14px", color: "#868686" }}
                                >
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#ff0101",
                                    }}
                                  >
                                    {alunoUser.seduc} | {alunoUser.orgao}
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginTop: "10px" }}>
                      Nenhum aluno dependente encontrado.
                    </div>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div>Selecione um Usuário para ver os detalhes</div>
          )}
        </div>
      </div>
      {/* fim da div da direita */}
      {/* Modal usado para cadastro e edição */}
      <CadastrarUsuarioModal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setModalData(null);
        }}
        onSubmit={async (dadosusuarios) => {
          const isEditando = !!modalData?.id;
          const url = isEditando
            ? `/api/user/${dadosusuarios.id}`
            : "/api/user";
          const method = isEditando ? "PATCH" : "POST";

          try {
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dadosusuarios),
            });
            const result = await res.json();
            if (!res.ok) {
              const msg =
                result?.details?.message ||
                result?.message ||
                result?.error ||
                (isEditando
                  ? "Erro ao editar usuário."
                  : "Erro ao cadastrar usuário.");
              toast.error(`Erro: ${msg}`);
              return;
            }

            if (isEditando) {
              setUsers((prev) =>
                prev.map((u) => (u.id === result.id ? result : u)),
              );
              toast.success("Usuário editado com sucesso!");
            } else {
              const novoUsuario = result?.user;

              if (!novoUsuario?.id) {
                toast.error("Erro: ID do novo usuário não foi retornado.");
                return;
              }

              setUsers((prev) => [...prev, novoUsuario]);

              toast.success("Usuário cadastrado com sucesso!");
            }

            setMostrarModal(false);
            setModalData(null);
          } catch (error) {
            console.error("Erro inesperado:", error);
            toast.error(
              isEditando
                ? "Erro interno ao editar usuário."
                : "Erro interno ao cadastrar usuário.",
            );
          }
        }}
        initialData={modalData}
      />

      {modalComunicacaoAberta && userAlvo && (
        <ComunicacaoModal
          isOpen={modalComunicacaoAberta}
          onClose={() => setModalComunicacaoAberta(false)}
          onSubmit={enviarComunicacao}
          userAlvo={userAlvo}
        />
      )}

      {modalAutorizacaoAberta && userAlvo && (
        <AutorizacaoModal
          isOpen={modalAutorizacaoAberta}
          onClose={() => setModalAutorizacaoAberta(false)}
          onSubmit={enviarAutorizacao}
          userAlvo={userAlvo}
        />
      )}

      {userSelecionado && (
        <CadastrarEnderecoModal
          isOpen={modalEnderecoAberto}
          onClose={() => setModalEnderecoAberto(false)}
          onSubmit={handleCadastrarEndereco}
          userId={userSelecionado.id}
        />
      )}
      <CadastrarAlunoModal
        isOpen={modalAlunoAberto}
        onClose={() => {
          setModalAlunoAberto(false);
          setAlunoData(null);
        }}
        initialData={alunoData}
        onSubmit={async (form: Aluno) => {
          try {
            const payload = {
              grauInicial: Number(form.grauInicial),
              grauAtual: Number(form.grauAtual),
              turmaId: form.turma?.id,
              userId: form.userId,
            };

            console.log("Payload enviado para /api/aluno:", payload);

            const resAluno = await fetch(`/api/aluno/${form.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!resAluno.ok) {
              toast.error("Erro ao salvar dados do aluno.");
              return;
            }

            // Agora envia somente os responsáveis separadamente
            const payloadResponsaveis = {
              resp1: form.responsavel1?.id || 0,
              resp2: form.responsavel2?.id || 0,
            };

            console.log(
              "Payload enviado para /responsaveis:",
              payloadResponsaveis,
            );

            const resResponsaveis = await fetch(
              `/api/aluno/${form.id}/responsaveis`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadResponsaveis),
              },
            );

            if (!resResponsaveis.ok) {
              toast.error("Erro ao atualizar responsáveis.");
              return;
            }

            toast.success("Dados do aluno salvos com sucesso!");

            const resUsuarioAtualizado = await fetch(
              `/api/user/${form.userId}`,
            );
            const usuarioAtualizado = await resUsuarioAtualizado.json();

            if (!resUsuarioAtualizado.ok || !usuarioAtualizado?.id) {
              toast.error("Erro ao buscar usuário atualizado.");
              return;
            }

            // Atualiza lista e detalhe com dados completos
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u.id === usuarioAtualizado.id ? usuarioAtualizado : u,
              ),
            );

            setUserSelecionado(usuarioAtualizado);

            setModalAlunoAberto(false);
            setAlunoData(null);
          } catch (error) {
            console.error("Erro ao salvar aluno:", error);
            toast.error("Erro ao salvar aluno.");
          }
        }}
      />
      {mostrarMenuModal && userMenuSelecionado && (
        <div
          onClick={() => setMostrarMenuModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "280px",
              maxWidth: "95%",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              animation: "fadeIn .2s ease",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Opções</h3>

            <ul style={{ padding: 0, margin: 0 }}>
              {/* EDITAR */}
              {userLogin?.typeUser === 10 && (
                <li
                  style={{
                    padding: "10px",
                    listStyle: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    setModalData(userMenuSelecionado);
                    setMostrarModal(true);
                    setMostrarMenuModal(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f2f2f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <FaEdit />
                  <span style={{ paddingLeft: "8px" }}>Editar</span>
                </li>
              )}

              {/* EXCLUIR */}
              {userLogin?.typeUser === 10 && (
                <li
                  style={{
                    padding: "10px",
                    listStyle: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    handleDelete(userMenuSelecionado.id);
                    setMostrarMenuModal(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f2f2f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <FaTrash />
                  <span style={{ paddingLeft: "8px" }}>Excluir</span>
                </li>
              )}

              {/* RESET SENHA */}
              {userLogin?.typeUser === 10 && (
                <li
                  style={{
                    padding: "10px",
                    listStyle: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    handleResetPassword(userMenuSelecionado.id);
                    setMostrarMenuModal(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f2f2f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <FaKey />
                  <span style={{ paddingLeft: "8px" }}>Redefinir Senha</span>
                </li>
              )}

              {/* COMUNICAÇÃO */}
              {[10, 5, 3].includes(userLogin?.typeUser ?? 0) && (
                <li
                  style={{
                    padding: "10px",
                    listStyle: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    abrirModalComunicacao(userMenuSelecionado);
                    setMostrarMenuModal(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f2f2f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <FaComment />
                  <span style={{ paddingLeft: "8px" }}>Comunicação</span>
                </li>
              )}

              {/* AUTORIZAÇÃO */}
              {[10, 5, 3, 1].includes(userLogin?.typeUser ?? 0) && (
                <li
                  style={{
                    padding: "10px",
                    listStyle: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    abrirModalAutorizacao(userMenuSelecionado);
                    setMostrarMenuModal(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f2f2f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <FaAddressCard />
                  <span style={{ paddingLeft: "8px" }}>Autorização</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
