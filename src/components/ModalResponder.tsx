// src/components/ModalResponder.tsx
"use client";

import styles from "../app/(privada)/privateLayout.module.css";

interface ModalResponderProps {
  resposta: string;
  setResposta: (resposta: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalResponder = ({
  resposta,
  setResposta,
  onClose,
  onSubmit,
}: ModalResponderProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Responder à Comunicação</h2>
        <textarea
          placeholder="Digite sua justificativa aqui..."
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          className={styles.inputRespostaTextarea}
          rows={5}
        />
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

export default ModalResponder;
