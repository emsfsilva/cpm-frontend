import styles from "@/app/(privada)/privateLayout.module.css";

interface ModalArquivamentoProps {
  isOpen: boolean;
  motivo: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function ModalArquivamento({
  isOpen,
  motivo,
  onChange,
  onSubmit,
  onClose,
}: ModalArquivamentoProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.tituloListar}>Arquivar Comunicação</h2>

        <h3>Informe o motivo do arquivamento</h3>
        <textarea
          placeholder="Digite o motivo do arquivamento"
          value={motivo}
          onChange={(e) => onChange(e.target.value)}
          className={styles.inputEnquadramentoTextarea}
          rows={3}
          maxLength={70}
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
