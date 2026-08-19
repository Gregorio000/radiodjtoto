import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

/** Pagina 404. */
export function NotFound() {
  return (
    <section className={`container ${styles.wrap}`}>
      <span className="eyebrow">Errore 404</span>
      <h1 className={styles.title}>Pagina non trovata</h1>
      <p className={styles.text}>
        La pagina che cerchi non esiste o è stata spostata. Ma la musica non si
        ferma mai.
      </p>
      <Link to="/" className={styles.btn}>
        Torna alla diretta
      </Link>
    </section>
  );
}
