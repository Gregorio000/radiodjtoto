import { Link } from 'react-router-dom';
import { Carosello } from '../carousel/Carosello';
import { usePlayer } from '../../context/PlayerContext';
import { PlayIcon } from '../common/Icons';
import styles from './Hero.module.css';

/**
 * Hero a tutta pagina: il carosello fa da sfondo, con un velo scuro sopra
 * e il testo di benvenuto sovrapposto. Il pulsante principale avvia la
 * diretta audio.
 */
export function Hero() {
  const { audio } = usePlayer();

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Carosello fill />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={`container ${styles.content}`}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Canzoni napoletane · In diretta
        </span>

        <h1 className={styles.title}>
          La voce di Napoli,
          <br className={styles.brk} />
          <span className={styles.accent}>sempre accesa.</span>
        </h1>

        <div className={styles.divider} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.note}>♪</span>
          <span className={styles.line} />
        </div>

        <p className={styles.lead}>
          La radio dedicata alla canzone napoletana: classici immortali e nuove
          voci della tradizione partenopea, in onda 24 ore su 24.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={audio.toggle}
            disabled={audio.streamUnavailable}
          >
            <PlayIcon size={18} />
            {audio.isPlaying ? 'Diretta in corso' : 'Ascolta la diretta'}
          </button>
          <Link to="/chi-siamo" className={styles.btnOutline}>
            Chi siamo
          </Link>
        </div>
      </div>

      <a href="#in-onda" className={styles.scrollHint} aria-label="Scorri in basso">
        <span className={styles.chev} />
      </a>
    </section>
  );
}
