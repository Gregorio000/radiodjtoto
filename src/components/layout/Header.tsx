import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.module.css';

const links = [
  { to: '/', label: 'Home', end: true },
  // { to: '/palinsesto', label: 'Palinsesto' },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/contatti', label: 'Contatti' },
];

/** Intestazione con logo e navigazione responsive (menu mobile a scomparsa). */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img src="/toto.png" alt="" className={styles.brandLogo} aria-hidden="true" />
          <span className={styles.brandText}>
            Radio<span className={styles.brandAccent}>DJToto</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span data-open={open} />
        </button>

        <nav
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label="Navigazione principale"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
