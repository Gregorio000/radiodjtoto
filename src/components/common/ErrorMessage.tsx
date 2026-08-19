import styles from './ErrorMessage.module.css';

interface Props {
  message: string;
  onRetry?: () => void;
}

/** Riquadro di errore con azione di ripetizione opzionale. */
export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className={styles.box} role="alert">
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Riprova
        </button>
      )}
    </div>
  );
}
