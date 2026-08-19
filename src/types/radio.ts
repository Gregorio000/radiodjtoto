/* =========================================================================
   Modello dati normalizzato usato in tutta l'app.
   L'API RadioBoss viene mappata su queste interfacce (vedi api/radioboss.ts),
   così i componenti non dipendono dal formato grezzo del server.
   ========================================================================= */

/** Un singolo brano, in forma normalizzata. */
export interface Track {
  /** Identificatore stabile (usato come React key). */
  id: string;
  title: string;
  artist: string;
  /** URL della copertina; se assente si usa il fallback. */
  cover?: string;
  /** Durata in secondi, se disponibile. */
  duration?: number;
  /** Orario di messa in onda (ISO string), se disponibile. */
  playedAt?: string;
}

/** Stato completo del "now playing": corrente + coda + cronologia. */
export interface NowPlayingState {
  current: Track | null;
  /** Brani successivi (i prossimi in scaletta). */
  queue: Track[];
  /** Brani precedenti (cronologia, dal più recente). */
  history: Track[];
}

/** Stato di caricamento condiviso dai componenti asincroni. */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
