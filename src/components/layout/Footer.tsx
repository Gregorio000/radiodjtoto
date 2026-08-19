import { Link } from 'react-router-dom';
import { config } from '../../config';
import styles from './Footer.module.css';

const year = new Date().getFullYear();

/** Piè di pagina con social, contatti e informazioni legali. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <div className={styles.brand}>
            <img src="/toto.png" alt="" className={styles.brandLogo} aria-hidden="true" />
            <span>
              Radio<span className={styles.accent}>DJToto</span>
            </span>
          </div>
          <p className={styles.tagline}>
            La radio delle canzoni napoletane. La tradizione partenopea, in
            diretta 24 ore su 24.
          </p>
        </div>

        <nav className={styles.col} aria-label="Link utili">
          <h4 className={styles.colTitle}>Naviga</h4>
          <Link to="/">Home</Link>
          {/* <Link to="/palinsesto">Palinsesto</Link> */}
          <Link to="/chi-siamo">Chi siamo</Link>
          <Link to="/contatti">Contatti</Link>
        </nav>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Seguici</h4>
          <div className={styles.social}>
            <a href={config.social.instagram} target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
            <a href={config.social.facebook} target="_blank" rel="noreferrer noopener">
              Facebook
            </a>
            <a href={config.social.youtube} target="_blank" rel="noreferrer noopener">
              YouTube
            </a>
            <a href={config.social.tiktok} target="_blank" rel="noreferrer noopener">
              TikTok
            </a>
          </div>
          <a className={styles.email} href={`mailto:${config.contact.email}`}>
            {config.contact.email}
          </a>
        </div>
      </div>

      <div className={`container ${styles.legal}`}>
        <p>
          © {year} RadioDJToto · radiodjtoto.it — Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
