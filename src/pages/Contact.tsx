import { config } from '../config';
import styles from './Contact.module.css';
import page from './Page.module.css';

/**
 * Pagina "Contatti": solo i recapiti diretti (email, luogo, social),
 * presentati in modo elegante. Nessun form.
 */
export function Contact() {
  // Link che apre direttamente la finestra "nuovo messaggio" di Gmail nel
  // browser, con il destinatario già compilato.
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    config.contact.email
  )}`;

  return (
    <>
      <header className={`container ${page.header}`}>
        <span className="eyebrow">Contatti</span>
        <h1>Scrivici, ti ascoltiamo</h1>
        <p className={page.lead}>
          Richieste musicali, dediche, collaborazioni o semplicemente due
          parole: siamo felici di sentirti.
        </p>
      </header>

      <section className={`container ${styles.wrap}`}>
        <div className={styles.grid}>
          <article className={styles.card}>
            <span className={styles.label}>Email</span>
            <a
              className={styles.value}
              href={gmailCompose}
              target="_blank"
              rel="noreferrer noopener"
            >
              {config.contact.email}
            </a>
            <a
              className={styles.cta}
              href={gmailCompose}
              target="_blank"
              rel="noreferrer noopener"
            >
              Invia una email
            </a>
          </article>
        </div>

        <article className={`${styles.card} ${styles.socialCard}`}>
          <span className={styles.label}>Seguici sui social</span>
          <div className={styles.socialRow}>
            <a
              className={styles.socialLink}
              href={config.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </a>
            <a
              className={styles.socialLink}
              href={config.social.facebook}
              target="_blank"
              rel="noreferrer noopener"
            >
              Facebook
            </a>
            <a
              className={styles.socialLink}
              href={config.social.youtube}
              target="_blank"
              rel="noreferrer noopener"
            >
              YouTube
            </a>
            <a
              className={styles.socialLink}
              href={config.social.tiktok}
              target="_blank"
              rel="noreferrer noopener"
            >
              TikTok
            </a>
          </div>
        </article>
      </section>
    </>
  );
}
