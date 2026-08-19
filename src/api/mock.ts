import type { NowPlayingState, Track } from '../types/radio';

/* =========================================================================
   Dati DEMO usati quando la configurazione RadioBoss è assente.
   Un piccolo catalogo di grandi classici napoletani, con leggera rotazione
   nel tempo per simulare un flusso "live".
   ========================================================================= */

const catalogo: Omit<Track, 'id'>[] = [
  { title: "'O Sole Mio", artist: 'Enrico Caruso', duration: 198 },
  { title: 'Reginella', artist: 'Roberto Murolo', duration: 224 },
  { title: 'Malafemmena', artist: 'Totò', duration: 187 },
  { title: 'Caruso', artist: 'Lucio Dalla', duration: 320 },
  { title: 'Era de Maggio', artist: 'Sergio Bruni', duration: 241 },
  { title: 'Anema e Core', artist: 'Tito Schipa', duration: 205 },
  { title: 'Tu vuò fà l’americano', artist: 'Renato Carosone', duration: 213 },
  { title: 'Napule è', artist: 'Pino Daniele', duration: 231 },
  { title: 'Dicitencello Vuje', artist: 'Massimo Ranieri', duration: 254 },
  { title: 'Indifferentemente', artist: 'Mario Trevi', duration: 199 },
];

/** Immagini di copertina generate come gradient (nessuna dipendenza esterna). */
function coverFor(index: number): string {
  const palettes = [
    ['#0b8bd0', '#0768a3'],
    ['#52c2ef', '#0b8bd0'],
    ['#7ad0f2', '#0a5d8f'],
  ];
  const [a, b] = palettes[index % palettes.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>
    </linearGradient></defs>
    <rect width='300' height='300' fill='url(#g)'/>
    <circle cx='150' cy='150' r='70' fill='none' stroke='#f4efe3' stroke-opacity='0.5' stroke-width='2'/>
    <circle cx='150' cy='150' r='10' fill='#f4efe3' fill-opacity='0.7'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeTrack(catalogIndex: number, uid: number, playedAt?: string): Track {
  const base = catalogo[catalogIndex % catalogo.length];
  return {
    id: `mock-${uid}`,
    ...base,
    cover: coverFor(catalogIndex),
    playedAt,
  };
}

/**
 * Restituisce uno stato mock che "avanza" nel tempo (un brano ogni ~4 min),
 * così durante il polling in demo il now playing cambia in modo realistico.
 */
export function getMockNowPlaying(): NowPlayingState {
  const step = Math.floor(Date.now() / (1000 * 60 * 4)); // avanza ogni 4 minuti
  const now = Date.now();

  const current = makeTrack(step, step, new Date(now).toISOString());

  const queue = [1, 2, 3, 4].map((offset) =>
    makeTrack(step + offset, step + offset)
  );

  const history = [1, 2, 3, 4].map((offset) =>
    makeTrack(
      step - offset,
      step - offset,
      new Date(now - offset * 4 * 60 * 1000).toISOString()
    )
  );

  return { current, queue, history };
}
