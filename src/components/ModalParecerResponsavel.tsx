// src/components/ModalParecerResponsavel.tsx
import styles from "@/app/(privada)/privateLayout.module.css";

interface ModalParecerResponsavelProps {
  isOpen: boolean;
  parecer: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function ModalParecerResponsavel({
  isOpen,
  parecer,
  onChange,
  onSubmit,
  onClose,
}: ModalParecerResponsavelProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Comentário do Responsável</h2>
        <textarea
          placeholder="Digite aqui o seu comentário sobre a resposta do aluno..."
          value={parecer}
          onChange={(e) => onChange(e.target.value)}
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
}
