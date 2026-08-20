import { Link } from 'react-router-dom';
import { config } from '../../config';
import {
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  TikTokIcon,
} from '../common/Icons';
import styles from './Footer.module.css';

const year = new Date().getFullYear();

/** Social con i rispettivi colori di brand. */
const socials = [
  { name: 'Instagram', href: config.social.instagram, Icon: InstagramIcon, color: '#E4405F' },
  { name: 'Facebook', href: config.social.facebook, Icon: FacebookIcon, color: '#1877F2' },
  { name: 'YouTube', href: config.social.youtube, Icon: YouTubeIcon, color: '#FF0000' },
  { name: 'TikTok', href: config.social.tiktok, Icon: TikTokIcon, color: '#111111' },
];

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
            {socials.map(({ name, href, Icon, color }) => (
              <a
                key={name}
                className={styles.socialIcon}
                style={{ color }}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
              >
                <Icon />
              </a>
            ))}
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
