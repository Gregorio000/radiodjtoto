import { usePlayer } from '../../context/PlayerContext';
import { TrackCover } from '../common/TrackCover';
import { PlayIcon, PauseIcon, LiveDot } from '../common/Icons';
import { Spinner } from '../common/Spinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatDuration } from '../../lib/format';
import styles from './NowPlaying.module.css';

/**
 * Riquadro "In onda ora": copertina grande, titolo, artista e pulsante
 * di ascolto. Si aggiorna automaticamente grazie al polling del context.
 */
export function NowPlaying() {
  const { audio, nowPlaying, status, error, refresh } = usePlayer();

  if (status === 'loading' && !nowPlaying) {
    return (
      <section className={styles.card} aria-busy="true">
        <Spinner label="Carico la diretta…" />
      </section>
    );
  }

  if (status === 'error' && !nowPlaying) {
    return (
      <section className={styles.card}>
        <ErrorMessage
          message={error ?? 'Impossibile caricare la diretta.'}
          onRetry={refresh}
        />
      </section>
    );
  }

  const current = nowPlaying?.current;

  return (
    <section className={styles.card} aria-label="Brano in onda">
      <div className={styles.badge}>
        <LiveDot size={8} className={styles.badgeDot} />
        In onda ora
      </div>

      <div className={styles.body}>
        <div className={styles.coverWrap}>
          <TrackCover
            src={current?.cover}
            alt={current ? `Copertina di ${current.title}` : 'Copertina'}
            className={styles.cover}
          />
          <span className={styles.vinyl} aria-hidden="true" />
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{current?.title ?? 'RadioDJToto'}</h2>
          <p className={styles.artist}>
            {current?.artist ?? 'Canzoni napoletane, in diretta'}
          </p>

          {current?.duration ? (
            <span className={styles.duration}>
              Durata {formatDuration(current.duration)}
            </span>
          ) : null}

          <button
            type="button"
            className={styles.listenBtn}
            onClick={audio.toggle}
            disabled={audio.streamUnavailable}
          >
            {audio.isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            {audio.isPlaying ? 'Pausa' : 'Ascolta la diretta'}
          </button>

          {audio.streamUnavailable && (
            <p className={styles.note}>
              Stream audio non ancora configurato (modalità demo).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
