"use client";

import { useEffect, useState } from "react";
import styles from "../privateLayout.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaRegUser,
  FaRegIdCard,
  FaRegAddressBook,
  FaSearch,
  FaGraduationCap,
  FaHeartbeat,
} from "react-icons/fa";
import { FaHandshakeSimple, FaPencil } from "react-icons/fa6";

interface User {
  id: number;
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
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userData="))
      ?.split("=")[1];

    if (userData) {
      try {
        const decoded = atob(decodeURIComponent(userData));
        const parsedUser = JSON.parse(decoded);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao parsear os dados do usuário do cookie:", error);
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Carregando...</div>;
  if (!user)
    return <div>Você não está autenticado. Redirecionando para o login...</div>;

  const inlineStyles = {
    dashboardContainer: {
      minHeight: "100vh",
      padding: "10px",
      textAlign: "center" as const,
      transition: "background 0.5s ease",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: 500,
      marginTop: "20px",
      marginBottom: "8px",
      color: "#656565",
      textAlign: "left" as const,
    },
  };

  return (
    <div style={inlineStyles.dashboardContainer}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "left",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: "5px",
        }}
      >
        <div>
          <span>Bem-Vindo!</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "30%",
            alignItems: "center",
          }}
        >
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Título */}
      <h2 style={inlineStyles.sectionTitle}>Atalhos</h2>

      {/* 🔥 Todos os ícones em um mesmo grid */}
      <div className={styles.iconGrid}>
        <div className={styles.iconBox}>
          <FaRegUser color="#125391" />
          <div
            onClick={() => router.push("/user")}
            style={{ cursor: "pointer" }}
            className={styles.iconLabel}
          >
            Usuários
          </div>
        </div>
        <div className={styles.iconBox}>
          <FaRegIdCard color="#125391" />
          <div
            onClick={() => router.push("/autorizacao")}
            style={{ cursor: "pointer" }}
            className={styles.iconLabel}
          >
            Autorização
          </div>
        </div>
        <div className={styles.iconBox}>
          <FaPencil color="#125391" />
          <div
            onClick={() => router.push("/comunicacao")}
            style={{ cursor: "pointer" }}
            className={styles.iconLabel}
          >
            Comunicação
          </div>
        </div>
        <div className={styles.iconBox}>
          <FaSearch color="#125391" />
          <div className={styles.iconLabel}>Pesquisar</div>
        </div>

        <div className={styles.iconBox}>
          <FaGraduationCap color="#969798" />
          <div className={styles.iconLabel}>Notas</div>
        </div>
        <div className={styles.iconBox}>
          <FaHandshakeSimple color="#969798" />
          <div className={styles.iconLabel}>Achados</div>
        </div>
        <div className={styles.iconBox}>
          <FaHeartbeat color="#969798" />
          <div className={styles.iconLabel}>E.Física</div>
        </div>
        <div className={styles.iconBox}>
          <FaRegAddressBook color="#969798" />
          <div className={styles.iconLabel}>Escalas</div>
        </div>
      </div>
    </div>
  );
}
