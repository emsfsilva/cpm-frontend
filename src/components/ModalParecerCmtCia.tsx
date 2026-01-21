import styles from "@/app/(privada)/privateLayout.module.css";

interface ModalParecerCmtCiaProps {
  isOpen: boolean;
  parecer: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function ModalParecerCmtCia({
  isOpen,
  parecer,
  onChange,
  onSubmit,
  onClose,
}: ModalParecerCmtCiaProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Parecer do Cmt da Cia</h2>
        <textarea
          placeholder="Digite seu Parecer aqui..."
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
