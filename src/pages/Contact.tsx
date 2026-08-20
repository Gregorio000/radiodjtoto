import { config } from '../config';
import {
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  TikTokIcon,
} from '../components/common/Icons';
import styles from './Contact.module.css';
import page from './Page.module.css';

/** Social con i rispettivi colori di brand. */
const socials = [
  { name: 'Instagram', href: config.social.instagram, Icon: InstagramIcon, color: '#E4405F' },
  { name: 'Facebook', href: config.social.facebook, Icon: FacebookIcon, color: '#1877F2' },
  { name: 'YouTube', href: config.social.youtube, Icon: YouTubeIcon, color: '#FF0000' },
  { name: 'TikTok', href: config.social.tiktok, Icon: TikTokIcon, color: '#111111' },
];

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
            {socials.map(({ name, href, Icon, color }) => (
              <a
                key={name}
                className={styles.socialLink}
                style={{ color }}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
