import { config } from '../../config';
import { FacebookIcon, TikTokIcon } from '../common/Icons';
import styles from './SocialFab.module.css';

/* Pulsanti social flottanti (in basso a destra, sopra la barra del player). */
const items = [
  {
    name: 'Facebook',
    href: config.social.facebook,
    Icon: FacebookIcon,
    color: '#1877F2',
    label: 'Seguici su Facebook',
  },
  {
    name: 'TikTok',
    href: config.social.tiktok,
    Icon: TikTokIcon,
    // Gradiente TikTok (ciano → magenta): più vivace del nero pieno.
    color: 'linear-gradient(135deg, #25F4EE 0%, #FE2C55 100%)',
    label: 'Seguici su TikTok',
  },
];

export function SocialFab() {
  return (
    <div className={styles.stack}>
      {items.map(({ name, href, Icon, color, label }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.btn}
          style={{ background: color }}
          aria-label={label}
        >
          <Icon size={26} />
          <span className={styles.tooltip}>{label}</span>
        </a>
      ))}
    </div>
  );
}
