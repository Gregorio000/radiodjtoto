import { usePlayer } from '../context/PlayerContext';
import { Hero } from '../components/hero/Hero';
import { NowPlaying } from '../components/nowplaying/NowPlaying';
import { TrackList } from '../components/tracklist/TrackList';
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
      {/* Hero con carosello di sfondo */}
      <Hero />

      {/* In onda ora */}
      <section id="in-onda" className={`container ${styles.nowSection}`}>
        <NowPlaying />
      </section>

      {/* Coda + Cronologia — una sola canzone ciascuna. */}
      <section className={`container ${styles.grid}`}>
        <TrackList
          title="A seguire"
          variant="queue"
          tracks={(nowPlaying?.queue ?? []).slice(0, 1)}
          emptyLabel="La scaletta si aggiornerà a breve."
        />
        <TrackList
          title="Appena trasmessi"
          variant="history"
          tracks={(nowPlaying?.history ?? []).slice(0, 1)}
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
