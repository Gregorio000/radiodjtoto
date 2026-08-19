import { config, isDemoMode } from '../config';
import type { NowPlayingState, Track } from '../types/radio';
import { getMockNowPlaying } from './mock';

/* =========================================================================
   Livello di accesso ai dati RadioBoss.
   -------------------------------------------------------------------------
   RadioBoss può esporre il "now playing" in JSON con nomi di campo diversi
   a seconda della configurazione del server. Per questo NON assumiamo una
   struttura rigida: leggiamo il JSON grezzo e lo normalizziamo verso il
   nostro modello (types/radio.ts) con un parser tollerante.

   Struttura JSON attesa (esempio flessibile — adattare all'endpoint reale):
   {
     "current": { "artist": "...", "title": "...", "cover": "...", "duration": 198 },
     "next":    [ { "artist": "...", "title": "..." }, ... ],   // coda
     "prev":    [ { "artist": "...", "title": "..." }, ... ]    // cronologia
   }

   Sono riconosciuti anche gli alias comuni:
   - corrente:  current | now_playing | nowplaying | np
   - coda:      next | queue | upcoming | nextsongs
   - storia:    prev | previous | history | recent | last
   - artista:   artist | performer | ARTIST
   - titolo:    title | song | track | TITLE
   - copertina: cover | art | artwork | image | picture
   ========================================================================= */

/**
 * In sviluppo (`npm run dev`) inoltriamo la richiesta al proxy locale di Vite
 * (vedi vite.config.ts), così il browser non blocca la chiamata per CORS.
 * In produzione si usa l'URL assoluto configurato.
 */
function resolveNowPlayingUrl(url: string): string {
  if (import.meta.env.DEV) {
    try {
      const u = new URL(url);
      return `/__radioboss${u.pathname}${u.search}`;
    } catch {
      return url;
    }
  }
  return url;
}

/** Errore tipizzato per distinguere i problemi di rete/parsing. */
export class RadioApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RadioApiError';
  }
}

/* ---- helper di normalizzazione ------------------------------------------ */

type RawObject = Record<string, unknown>;

/** Legge il primo campo presente tra una lista di alias. */
function pick(obj: RawObject, keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] != null && obj[k] !== '') return obj[k];
  }
  return undefined;
}

function toStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v != null ? String(v) : '';
}

function toNum(v: unknown): number | undefined {
  const n = typeof v === 'number' ? v : parseFloat(toStr(v));
  return Number.isFinite(n) ? n : undefined;
}

/** Converte un oggetto grezzo in un Track normalizzato. */
function normalizeTrack(raw: unknown, index: number): Track | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as RawObject;

  // Alcuni feed uniscono artista e titolo in un solo campo "Artist - Title".
  let artist = toStr(pick(o, ['artist', 'performer', 'ARTIST', 'artistName']));
  let title = toStr(pick(o, ['title', 'song', 'track', 'TITLE', 'name']));

  const combined = toStr(pick(o, ['nowplaying', 'np', 'text', 'display']));
  if (!title && combined.includes(' - ')) {
    const [a, ...rest] = combined.split(' - ');
    artist = artist || a.trim();
    title = rest.join(' - ').trim();
  }
  if (!title && !artist && combined) {
    title = combined;
  }
  if (!title && !artist) return null;

  const cover = toStr(pick(o, ['cover', 'art', 'artwork', 'image', 'picture', 'albumart']));
  const duration = toNum(pick(o, ['duration', 'len', 'length', 'seconds']));
  const playedAt = toStr(pick(o, ['playedAt', 'played_at', 'time', 'date', 'timestamp']));

  return {
    id:
      toStr(pick(o, ['id', 'uid', 'guid'])) ||
      `${artist}-${title}-${index}`,
    artist: artist || 'Sconosciuto',
    title: title || 'Senza titolo',
    cover: cover || undefined,
    duration,
    playedAt: playedAt || undefined,
  };
}

/** Normalizza una lista grezza (tollerante a null/formati misti). */
function normalizeList(raw: unknown, max: number): Track[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i) => normalizeTrack(item, i))
    .filter((t): t is Track => t !== null)
    .slice(0, max);
}

/* ---- formato Icecast (status-json.xsl di RadioBoss.fm) ------------------- */

/**
 * Divide la riga metadati Icecast in artista + titolo.
 * Il server invia una stringa unica, es.:
 *   "Etichetta - GIUSY ATTANASIO - Pure pe' sbaglià - (compositori)"
 * Strategia: si rimuovono le parentesi finali (compositori/note) e si
 * prendono gli ultimi due segmenti separati da " - " (artista, titolo),
 * scartando eventuali prefissi come l'etichetta. Funziona anche col
 * classico "Artista - Titolo".
 */
function splitIcecastTitle(raw: string): { artist: string; title: string } {
  let s = raw.trim();
  // Rimuove uno o più gruppi tra parentesi in coda (compositori/note).
  s = s.replace(/\s*\([^()]*\)\s*$/, '').trim();
  // Ripulisce trattini e spazi rimasti agli estremi.
  s = s.replace(/^[\s\-–—]+|[\s\-–—]+$/g, '');

  const parts = s
    .split(' - ')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return { artist: '', title: raw.trim() };
  if (parts.length === 1) return { artist: '', title: parts[0] };
  return {
    artist: parts[parts.length - 2],
    title: parts[parts.length - 1],
  };
}

/** Riconosce e converte la risposta Icecast (status-json.xsl). */
function parseIcecast(root: RawObject): NowPlayingState | null {
  const icestats = root['icestats'];
  if (!icestats || typeof icestats !== 'object') return null;

  let sources = (icestats as RawObject)['source'];
  if (!sources) return { current: null, queue: [], history: [] };
  // "source" può essere un singolo oggetto o un array di mount.
  const list = Array.isArray(sources) ? sources : [sources];

  // Preferiamo il primo mount che espone un titolo.
  const src =
    (list.find(
      (s) => s && typeof s === 'object' && toStr((s as RawObject)['title'])
    ) as RawObject) || (list[0] as RawObject);

  const rawTitle = toStr(pick(src ?? {}, ['title', 'yp_currently_playing']));
  if (!rawTitle) return { current: null, queue: [], history: [] };

  const { artist, title } = splitIcecastTitle(rawTitle);

  const current: Track = {
    id: `ice-${artist}-${title}`,
    artist: artist || 'RadioDJToto',
    title: title || rawTitle,
  };

  // Icecast fornisce solo il brano corrente: coda e cronologia restano
  // vuote qui e vengono gestite lato client (vedi useNowPlaying).
  return { current, queue: [], history: [] };
}

/** Trasforma il JSON RadioBoss grezzo nel nostro NowPlayingState. */
export function parseRadioBoss(data: unknown): NowPlayingState {
  const root = (data && typeof data === 'object' ? data : {}) as RawObject;

  // Formato Icecast (RadioBoss.fm)?
  const ice = parseIcecast(root);
  if (ice) return ice;

  const currentRaw = pick(root, ['current', 'now_playing', 'nowplaying', 'np', 'song']);
  const queueRaw = pick(root, ['next', 'queue', 'upcoming', 'nextsongs', 'coming']);
  const historyRaw = pick(root, ['prev', 'previous', 'history', 'recent', 'last', 'played']);

  return {
    current: normalizeTrack(currentRaw ?? root, 0),
    queue: normalizeList(queueRaw, config.MAX_QUEUE_ITEMS),
    history: normalizeList(historyRaw, config.MAX_HISTORY_ITEMS),
  };
}

/* ---- fetch pubblico ------------------------------------------------------ */

/**
 * Recupera lo stato "now playing".
 * - In modalità DEMO (nessun URL configurato) usa i dati mock.
 * - Altrimenti chiama l'endpoint RadioBoss, con timeout e gestione errori.
 */
export async function fetchNowPlaying(signal?: AbortSignal): Promise<NowPlayingState> {
  if (isDemoMode) {
    // Piccolo ritardo per simulare la latenza di rete in demo.
    await new Promise((r) => setTimeout(r, 300));
    return getMockNowPlaying();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  // Se il chiamante annulla, annulliamo anche noi.
  signal?.addEventListener('abort', () => controller.abort());

  try {
    const res = await fetch(resolveNowPlayingUrl(config.RADIOBOSS_NOWPLAYING_URL), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new RadioApiError(`Risposta del server non valida (HTTP ${res.status}).`);
    }

    const data = await res.json();
    return parseRadioBoss(data);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new RadioApiError('Richiesta annullata o scaduta.');
    }
    if (err instanceof RadioApiError) throw err;
    throw new RadioApiError(
      'Impossibile contattare il servizio radio. Riproveremo a breve.'
    );
  } finally {
    clearTimeout(timeout);
  }
}
