// src/components/ModalEnquadramento.tsx
"use client";

import styles from "../app/(privada)/privateLayout.module.css";

interface ModalEnquadramentoProps {
  grauMotivo: string;
  setgrauMotivo: (value: string) => void;
  natureza: string;
  setnatureza: (value: string) => void;
  enquadramento: string;
  setenquadramento: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalEnquadramento = ({
  grauMotivo,
  setgrauMotivo,
  natureza,
  setnatureza,
  enquadramento,
  setenquadramento,
  onClose,
  onSubmit,
}: ModalEnquadramentoProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.tituloListar}>Enquadramento</h2>

        <h3>Informe o valor total do enquadramento</h3>
        <input
          className={styles.inputEnquadramento}
          type="number"
          placeholder="Ex: 0.5 ou 1.5"
          value={grauMotivo}
          onChange={(e) => setgrauMotivo(e.target.value)}
        />

        <h3>Natureza da Comunicação</h3>
        <select
          className={styles.inputEnquadramento}
          value={natureza}
          onChange={(e) => setnatureza(e.target.value)}
        >
          <option value="">Selecione a natureza</option>
          <option value="Leve">Leve</option>
          <option value="Media">Média</option>
          <option value="Grave">Grave</option>
        </select>

        <h3>Descreva o motivo do enquadramento</h3>
        <textarea
          placeholder="Ex: Uma atenuante e duas agravantes..."
          value={enquadramento}
          onChange={(e) => setenquadramento(e.target.value)}
          className={styles.inputEnquadramentoTextarea}
          rows={3}
          maxLength={70}
        />
        <div className={styles.charCounter}>
          {enquadramento.length} / 70 caracteres
        </div>

        <div className={styles.modalActions}>
          <button onClick={onSubmit} className={styles.enviarRespBtn}>
            Enviar
          </button>
          <button onClick={onClose} className={styles.cancelarBtn}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEnquadramento;
