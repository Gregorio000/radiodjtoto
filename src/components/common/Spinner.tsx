import styles from './Spinner.module.css';

/** Indicatore di caricamento accessibile (ruota dorata). */
export function Spinner({ label = 'Caricamento…' }: { label?: string }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.ring} />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
