import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LivePlayer } from '../player/LivePlayer';
import { SocialFab } from '../floating/SocialFab';
import styles from './Layout.module.css';

/**
 * Struttura di pagina condivisa: header sticky, contenuto, footer e la barra
 * del player live sempre visibile in basso.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
      <LivePlayer />
      <SocialFab />
    </div>
  );
}
