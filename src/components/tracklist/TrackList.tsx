import type { Track } from '../../types/radio';
import { TrackCover } from '../common/TrackCover';
import { formatDuration, formatTime } from '../../lib/format';
import styles from './TrackList.module.css';

interface Props {
  title: string;
  tracks: Track[];
  /** 'queue' mostra la numerazione, 'history' mostra l'orario di messa in onda. */
  variant: 'queue' | 'history';
  emptyLabel?: string;
}

/** Elenco di brani riutilizzabile per la coda e per la cronologia. */
export function TrackList({ title, tracks, variant, emptyLabel }: Props) {
  return (
    <section className={styles.wrap} aria-label={title}>
      <h3 className={styles.heading}>
        <span className={styles.headingText}>{title}</span>
        <span className={styles.count}>{tracks.length}</span>
      </h3>

      {tracks.length === 0 ? (
        <p className={styles.empty}>{emptyLabel ?? 'Nessun brano disponibile.'}</p>
      ) : (
        <ol className={styles.list}>
          {tracks.map((t, i) => (
            <li key={t.id} className={styles.item}>
              <span className={styles.index} aria-hidden="true">
                {variant === 'queue' ? i + 1 : formatTime(t.playedAt) || '—'}
              </span>
              <TrackCover
                src={t.cover}
                alt={`Copertina di ${t.title}`}
                className={styles.cover}
              />
              <span className={styles.meta}>
                <span className={styles.title}>{t.title}</span>
                <span className={styles.artist}>{t.artist}</span>
              </span>
              {t.duration ? (
                <span className={styles.duration}>{formatDuration(t.duration)}</span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
