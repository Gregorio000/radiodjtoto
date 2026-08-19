import { useState } from 'react';
import { config } from '../../config';

interface Props {
  src?: string;
  alt: string;
  className?: string;
}

/**
 * Copertina di un brano con fallback automatico.
 * Se l'URL manca o l'immagine non si carica, mostra il placeholder dorato.
 */
export function TrackCover({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  const finalSrc = !src || failed ? config.FALLBACK_COVER : src;

  return (
    <img
      className={className}
      src={finalSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
