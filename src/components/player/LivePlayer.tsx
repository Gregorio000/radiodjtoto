import { usePlayer } from '../../context/PlayerContext';
import { TrackCover } from '../common/TrackCover';
import { PlayIcon, PauseIcon, LiveDot } from '../common/Icons';
import { VolumeControl } from './VolumeControl';
import styles from './LivePlayer.module.css';

/**
 * Barra del player live, fissa in fondo alla pagina e sempre accessibile.
 * Mostra il brano corrente, il pulsante play/pause e il controllo volume.
 */
export function LivePlayer() {
  const { audio, nowPlaying } = usePlayer();
  const current = nowPlaying?.current;

  const statusLabel =
    audio.status === 'buffering'
      ? 'Connessione…'
      : audio.status === 'error'
        ? audio.streamUnavailable
          ? 'Stream non configurato'
          : 'Stream non disponibile'
        : audio.isPlaying
          ? 'In diretta'
          : 'In pausa';

  return (
    <div className={styles.bar} role="region" aria-label="Player radio live">
      <div className={`container ${styles.inner}`}>
        {/* Brano corrente */}
        <div className={styles.track}>
          <TrackCover
            src={current?.cover}
            alt={current ? `Copertina di ${current.title}` : 'Copertina'}
            className={styles.cover}
          />
          <div className={styles.meta}>
            <span className={styles.title}>
              {current?.title ?? 'RadioDJToto'}
            </span>
            <span className={styles.artist}>
              {current?.artist ?? 'Canzoni napoletane'}
            </span>
          </div>
        </div>

        {/* Controllo di riproduzione */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.playBtn}
            onClick={audio.toggle}
            disabled={audio.streamUnavailable}
            aria-label={audio.isPlaying ? 'Metti in pausa' : 'Riproduci la diretta'}
            data-buffering={audio.status === 'buffering'}
          >
            {audio.isPlaying ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
          </button>
        </div>

        {/* Stato + volume */}
        <div className={styles.right}>
          <span
            className={styles.live}
            data-on={audio.isPlaying}
            title={statusLabel}
          >
            <LiveDot size={8} />
            {statusLabel}
          </span>
          <VolumeControl
            volume={audio.volume}
            isMuted={audio.isMuted}
            onVolume={audio.setVolume}
            onToggleMute={audio.toggleMute}
          />
        </div>
      </div>
    </div>
  );
}
