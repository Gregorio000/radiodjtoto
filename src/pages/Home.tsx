import { usePlayer } from '../context/PlayerContext';
import { NowPlaying } from '../components/nowplaying/NowPlaying';
import { TrackList } from '../components/tracklist/TrackList';
import { Carosello } from '../components/carousel/Carosello';
import { isDemoMode } from '../config';
import styles from './Home.module.css';

/**
 * Home: brano in onda ora + coda (successivi) + cronologia (precedenti),
 * tutto aggiornato in tempo reale via polling.
 */
export function Home() {
  const { nowPlaying } = usePlayer();

  return (
    <>
      {/* Carosello immagini */}
      <section className={`container ${styles.carousel}`}>
        <Carosello />
      </section>

      {/* Hero */}
      <section className={`container ${styles.hero}`}>
        <span className="eyebrow">Radio · Napoli · In diretta</span>
        <h1 className={styles.heroTitle}>
          La voce di Napoli, <br />
          <span className={styles.accent}>senza mai spegnersi.</span>
        </h1>
        <p className={styles.heroLead}>
          RadioDJToto è la radio dedicata alla canzone napoletana: classici
          immortali e nuove voci della tradizione partenopea, in onda 24 ore su
          24.
        </p>
      </section>

      {/* In onda ora */}
      <section className="container">
        <NowPlaying />
      </section>

      {/* Coda + Cronologia */}
      <section className={`container ${styles.grid}`}>
        <TrackList
          title="A seguire"
          variant="queue"
          tracks={nowPlaying?.queue ?? []}
          emptyLabel="La scaletta si aggiornerà a breve."
        />
        <TrackList
          title="Appena trasmessi"
          variant="history"
          tracks={nowPlaying?.history ?? []}
          emptyLabel="Nessun brano in cronologia."
        />
      </section>

      {isDemoMode && (
        <p className={`container ${styles.demoNote}`}>
          Modalità demo attiva: i brani mostrati sono di esempio. Inserisci
          l'endpoint RadioBoss in <code>src/config.ts</code> per i dati reali.
        </p>
      )}
    </>
  );
}
