// src/components/ModalPublicacao.tsx
import styles from "@/app/(privada)/privateLayout.module.css";

interface ModalPublicacaoProps {
  isOpen: boolean;
  observacao: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function ModalPublicacao({
  isOpen,
  observacao,
  onChange,
  onSubmit,
  onClose,
}: ModalPublicacaoProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Publicar Comunicação</h2>
        <textarea
          placeholder="Observação sobre a publicação (opcional)..."
          value={observacao}
          onChange={(e) => onChange(e.target.value)}
          className={styles.inputRespostaTextarea}
          rows={5}
        />
        <div className={styles.modalActions}>
          <button onClick={onSubmit} className={styles.enviarRespBtn}>
            Publicar
          </button>
          <button onClick={onClose} className={styles.cancelarBtn}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
