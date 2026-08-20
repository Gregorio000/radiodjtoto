import { useEffect, useState } from 'react';
import styles from './Carosello.module.css';

/* =========================================================================
   Carosello di immagini per la parte iniziale della Home.
   - Dissolvenza automatica tra le foto ogni INTERVAL_MS.
   - Pallini di navigazione cliccabili.
   - Si mette in pausa quando il puntatore è sopra il carosello.
   Le foto vanno messe nella cartella /public con nome "foto (1).jpg", ecc.
   Per aggiungerne/rimuoverne basta cambiare PHOTO_COUNT o EXT.
   ========================================================================= */

const PHOTO_COUNT = 11;
const EXT = 'jpeg';
const INTERVAL_MS = 3000;

const images = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `/foto (${i + 1}).${EXT}`
);

/**
 * @param fill  Se true, il carosello riempie il contenitore genitore come
 *              sfondo (nessun bordo/arrotondamento, niente pallini): usato
 *              dietro la hero.
 */
export function Carosello({ fill = false }: { fill?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div
      className={`${styles.wrap} ${fill ? styles.fill : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Galleria immagini"
    >
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`RadioDJToto ${index + 1}`}
          className={`${styles.slide} ${
            index === currentIndex ? styles.active : ''
          }`}
          loading={index === 0 ? 'eager' : 'lazy'}
          // Se una foto manca, la slide viene nascosta senza rompere il layout.
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
          }}
        />
      ))}

      {/* Velo scuro in basso per far risaltare i pallini (solo modalità card). */}
      {!fill && <div className={styles.veil} aria-hidden="true" />}

      {!fill && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              aria-label={`Vai all'immagine ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
