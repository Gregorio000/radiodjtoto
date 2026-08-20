/* =========================================================================
   Configurazione centralizzata di RadioDJToto
   -------------------------------------------------------------------------
   >>> QUI VANNO INSERITI I DUE URL FORNITI DA RADIOBOSS <<<

   1. RADIOBOSS_NOWPLAYING_URL
      Endpoint (JSON) che espone il brano corrente, la coda e la cronologia.
      Esempio tipico RadioBoss:  https://<tuo-server>/api/nowplaying
      oppure un file statico aggiornato dal software, es. .../nowplaying.json

   2. AUDIO_STREAM_URL
      URL dello stream audio live (Icecast/Shoutcast), es.
      https://<tuo-server>:8000/stream  oppure  .../live.mp3

   Finché gli URL restano vuoti, l'app funziona in modalità DEMO usando i
   dati mock (src/api/mock.ts), così puoi vedere subito il sito in locale.
   ========================================================================= */

export const config = {
  /** Endpoint JSON con brano corrente / coda / cronologia.
   *  Punta alla funzione serverless /api/nowplaying (vedi api/nowplaying.js),
   *  che interroga l'API di RadioBOSS Cloud tenendo segreta la API key. */
  RADIOBOSS_NOWPLAYING_URL: '/api/nowplaying',

  /** URL dello stream audio live (Icecast/Shoutcast/MP3). */
  AUDIO_STREAM_URL: 'https://c26.radioboss.fm:8795/stream',

  /** Intervallo di polling del "now playing", in millisecondi. */
  POLL_INTERVAL_MS: 15_000,

  /** Numero massimo di brani mostrati nella coda e nella cronologia. */
  MAX_QUEUE_ITEMS: 5,
  MAX_HISTORY_ITEMS: 5,

  /** Immagine di copertina usata quando un brano non ne ha una. */
  FALLBACK_COVER: '/toto.png',

  /** Dati di contatto e social (usati in Contatti e nel Footer). */
  contact: {
    email: 'salvatorelamantia020159@gmail.com',
  },
  social: {
    instagram: 'https://instagram.com/salv.atore159',
    facebook: 'https://facebook.com/Salvatore.lamantia.129',
    youtube: 'https://youtube.com/@SalvatoreLaMantia-z3e',
    tiktok: 'https://tiktok.com/@salvatorel59',
  },
} as const;

/** True quando manca la configurazione: l'app usa i dati mock. */
export const isDemoMode = config.RADIOBOSS_NOWPLAYING_URL.trim() === '';
