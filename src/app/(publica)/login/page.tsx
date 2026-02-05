"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";

export default function Login() {
  const [seduc, setSeduc] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("HANDLE SUBMIT DISPAROU");
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seduc, password }),
      });

      console.log("STATUS =", response.status);
      console.log("OK =", response.ok);

      const data = await response.json();

      console.log("DATA =", data);

      if (response.ok) {
        router.push("/dashboard");
        router.refresh(); // força o layout reler os cookies
      } else {
        setErrorMessage(data?.error || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao enviar login:", error);
      setErrorMessage("Erro na requisição de login");
    }
  };

  const Slider = dynamic(() => import("react-slick"), {
    ssr: false,
  });

  const images = [
    "/assets/images/site/carrossel/carrossel_foto_01.jpeg",
    "/assets/images/site/carrossel/carrossel_foto_02.jpeg",
    "/assets/images/site/carrossel/carrossel_foto_03.jpeg",
    "/assets/images/site/carrossel/carrossel_foto_04.jpeg",
    "/assets/images/site/carrossel/carrossel_foto_05.jpeg",
  ];

  return (
    <div>
      <div
        style={{ width: "100%", height: "30px", backgroundColor: "#141a28" }}
      ></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <div>
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={90}
            height={90}
            className={styles.imglogo}
          />
        </div>

        <div style={{ marginLeft: "10px" }}>
          <h1 className={styles.textoDesktop}>
            COLÉGIO DA POLÍCIA MILITAR - CPM
          </h1>
          <h1 className={styles.textoMobile}>CPM - PE</h1>
        </div>
      </div>

      <div className={styles.divBotao}>
        <button className={styles.botao} onClick={() => setShowModal(true)}>
          Login
        </button>
        <button className={styles.botao}>Fale Conosco</button>
      </div>

      <div style={{ width: "100%", overflow: "hidden" }}>
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={4000}
          arrows={false}
        >
          {images.map((src, index) => (
            <div key={index}>
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

      <div className={styles.divTextoCpm}>
        <div className={styles.divTextoCpmSecundario}>
          <div
            style={{
              borderLeft: "3px solid #304486",
            }}
          >
            <h1 className={styles.h1Cpm}>O CPM EM CADA FASE DO SEU FILHO</h1>
          </div>
        </div>

        <div className={styles.divSlidPrincipal}>
          <div className={styles.divItemSlid}>
            <div style={{ height: "60%" }}>
              <Image
                src="/assets/images/site/slide/slide_foto_01.jpeg"
                alt="Logo"
                width={800}
                height={880}
              />
            </div>
            <div
              style={{ background: "#6984d4", height: "40%" }}
              className={styles.divTextoSlid}
            >
              EDUCAÇÃO <br></br>INFANTIL
            </div>
          </div>

          <div className={styles.divItemSlid}>
            <div style={{ height: "60%" }}>
              <Image
                src="/assets/images/site/slide/slide_foto_02.jpeg"
                alt="Logo"
                width={800}
                height={880}
              />
            </div>
            <div
              style={{ background: "#5976d3", height: "40%" }}
              className={styles.divTextoSlid}
            >
              ENSINO <br></br>FUNDAMENTAL 1
            </div>
          </div>

          <div className={styles.divItemSlid}>
            <div style={{ height: "60%" }}>
              <Image
                src="/assets/images/site/slide/slide_foto_03.jpeg"
                alt="Logo"
                width={800}
                height={880}
              />
            </div>
            <div
              style={{ background: "#3957bb", height: "40%" }}
              className={styles.divTextoSlid}
            >
              ENSINO <br></br>FUNDAMENTAL 2
            </div>
          </div>

          <div className={styles.divItemSlid}>
            <div style={{ height: "60%" }}>
              <Image
                src="/assets/images/site/slide/slide_foto_04.jpeg"
                alt="Logo"
                width={800}
                height={880}
              />
            </div>
            <div
              style={{ background: "#2f4794", height: "40%" }}
              className={styles.divTextoSlid}
            >
              NOVO <br></br>ENSINO MEDIO
            </div>
          </div>

          <div className={styles.divItemSlid}>
            <div style={{ height: "60%" }}>
              <Image
                src="/assets/images/site/slide/slide_foto_10.jpeg"
                alt="Logo"
                width={800}
                height={880}
              />
            </div>
            <div
              style={{ background: "#14308d", height: "40%" }}
              className={styles.divTextoSlid}
            >
              TURNO <br></br>COMPLEMENTAR
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div
                style={{
                  justifyContent: "center",
                  justifyItems: "center",
                  marginTop: "200px",
                }}
              >
                <Image
                  src="/assets/images/logo.png"
                  alt="Logo"
                  width={130}
                  height={130}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Login</label>
                <input
                  type="text"
                  value={seduc}
                  onChange={(e) => setSeduc(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              {errorMessage && <p className={styles.error}>{errorMessage}</p>}

              <button type="submit" className={styles.button}>
                Entrar
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={styles.button}
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
