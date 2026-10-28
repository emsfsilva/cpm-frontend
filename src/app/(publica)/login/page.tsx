"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./login.module.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importado uma única vez, fora do componente.
// Antes estava dentro do componente e era recriado a cada render,
// causando remount do carrossel (perda de estado, piscar de tela).
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const CAROUSEL_IMAGES = [
  "/assets/images/site/carrossel/carrossel_foto_01.jpeg",
  "/assets/images/site/carrossel/carrossel_foto_02.jpeg",
  "/assets/images/site/carrossel/carrossel_foto_03.jpeg",
  "/assets/images/site/carrossel/carrossel_foto_04.jpeg",
  "/assets/images/site/carrossel/carrossel_foto_05.jpeg",
];

const PHASES = [
  {
    img: "/assets/images/site/slide/slide_foto_01.jpeg",
    label: ["EDUCAÇÃO", "INFANTIL"],
    bg: "#6984d4",
  },
  {
    img: "/assets/images/site/slide/slide_foto_02.jpeg",
    label: ["ENSINO", "FUNDAMENTAL 1"],
    bg: "#5976d3",
  },
  {
    img: "/assets/images/site/slide/slide_foto_03.jpeg",
    label: ["ENSINO", "FUNDAMENTAL 2"],
    bg: "#3957bb",
  },
  {
    img: "/assets/images/site/slide/slide_foto_04.jpeg",
    label: ["NOVO", "ENSINO MEDIO"],
    bg: "#2f4794",
  },
  {
    img: "/assets/images/site/slide/slide_foto_10.jpeg",
    label: ["TURNO", "COMPLEMENTAR"],
    bg: "#14308d",
  },
];

export default function Login() {
  const [seduc, setSeduc] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Fecha com ESC e trava o scroll da página enquanto a modal está aberta
  useEffect(() => {
    if (!showModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [showModal]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setErrorMessage("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seduc, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
        router.refresh(); // força o layout reler os cookies
      } else {
        setErrorMessage(data?.error || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao enviar login:", error);
      setErrorMessage("Erro na requisição de login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.topBar} />

      <header className={styles.header}>
        <Image
          src="/assets/images/logo.png"
          alt="Logo do Colégio da Polícia Militar"
          width={90}
          height={90}
          className={styles.imglogo}
          priority
        />
        <div>
          <h1 className={styles.textoDesktop}>
            COLÉGIO DA POLÍCIA MILITAR - CPM
          </h1>
          <h1 className={styles.textoMobile}>CPM - PE</h1>
        </div>
      </header>

      <div className={styles.divBotao}>
        <button
          type="button"
          className={styles.botao}
          onClick={() => setShowModal(true)}
        >
          Login
        </button>
        <button type="button" className={styles.botao}>
          Fale Conosco
        </button>
      </div>

      <div className={styles.carouselWrapper}>
        <Slider
          dots
          infinite
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={4000}
          arrows={false}
        >
          {CAROUSEL_IMAGES.map((src, index) => (
            <div key={src}>
              <div className={styles.carouselAspect}>
                <Image
                  src={src}
                  alt={`Carrossel ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <section className={styles.divTextoCpm}>
        <div className={styles.divTextoCpmSecundario}>
          <div className={styles.tituloBorda}>
            <h2 className={styles.h1Cpm}>O CPM EM CADA FASE DO SEU FILHO</h2>
          </div>
        </div>

        <div className={styles.divSlidPrincipal}>
          {PHASES.map((phase) => (
            <div className={styles.divItemSlid} key={phase.img}>
              <div className={styles.slidImageWrapper}>
                <Image
                  src={phase.img}
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 90vw, 20vw"
                />
              </div>
              <div
                className={styles.divTextoSlid}
                style={{ background: phase.bg }}
              >
                {phase.label[0]}
                <br />
                {phase.label[1]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Fechar"
            >
              ✕
            </button>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.modalLogoWrapper}>
                <Image
                  src="/assets/images/logo.png"
                  alt="Logo"
                  width={110}
                  height={110}
                />
              </div>

              <h2 id="login-modal-title" className={styles.srOnly}>
                Login
              </h2>

              <div className={styles.inputGroup}>
                <label htmlFor="seduc">Login</label>
                <input
                  id="seduc"
                  name="seduc"
                  type="text"
                  autoComplete="username"
                  value={seduc}
                  onChange={(e) => setSeduc(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              {errorMessage && (
                <p className={styles.error} role="alert">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                onClick={closeModal}
                className={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
