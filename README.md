# RadioDJToto 🎙️

Sito web ufficiale di **RadioDJToto** (radiodjtoto.it), la radio dedicata alle
canzoni napoletane. Mostra in tempo reale il brano in onda, la coda dei brani
successivi e la cronologia di quelli appena trasmessi, con un player audio live
sempre accessibile.

Stile: tema scuro elegante con accenti oro/ambra, tipografia raffinata,
responsive (mobile-first) e accessibile.

---

## Stack tecnico

- **Vite** + **React 18** + **TypeScript**
- **React Router** per la navigazione tra le pagine
- **CSS Modules** per lo styling (nessun framework CSS esterno)
- Nessuna dipendenza superflua (icone SVG inline, copertine di fallback generate)

---

## Requisiti

- Node.js **18+** (consigliato 20+)
- npm 9+

---

## Avvio in locale

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il server di sviluppo (apre http://localhost:5173)
npm run dev
```

Al primo avvio il sito parte in **modalità demo**: mostra brani napoletani di
esempio, così puoi vedere subito l'interfaccia funzionante senza configurare
nulla.

---

## Configurazione RadioBoss (dati reali)

Tutta la configurazione è centralizzata in **`src/config.ts`**. Inserisci i due
URL forniti dal tuo server RadioBoss:

```ts
export const config = {
  // Endpoint JSON con brano corrente / coda / cronologia
  RADIOBOSS_NOWPLAYING_URL: 'https://tuo-server/api/nowplaying',

  // URL dello stream audio live (Icecast / Shoutcast / MP3)
  AUDIO_STREAM_URL: 'https://tuo-server:8000/stream',

  // ...altre impostazioni (polling, social, contatti)
};
```

Appena `RADIOBOSS_NOWPLAYING_URL` è valorizzato, la modalità demo si disattiva e
l'app inizia a leggere i dati reali (polling ogni 15 secondi, configurabile).

### Formato JSON atteso

Il parser (`src/api/radioboss.ts`) è **tollerante** e riconosce diversi nomi di
campo comuni in RadioBoss. La struttura di riferimento è:

```json
{
  "current": {
    "artist": "Roberto Murolo",
    "title": "Reginella",
    "cover": "https://.../reginella.jpg",
    "duration": 224
  },
  "next": [
    { "artist": "Totò", "title": "Malafemmena" }
  ],
  "prev": [
    { "artist": "Enrico Caruso", "title": "'O Sole Mio", "playedAt": "2026-07-23T21:00:00Z" }
  ]
}
```

Alias riconosciuti automaticamente:

| Campo       | Alias accettati                                        |
| ----------- | ------------------------------------------------------ |
| corrente    | `current`, `now_playing`, `nowplaying`, `np`, `song`   |
| coda        | `next`, `queue`, `upcoming`, `nextsongs`, `coming`     |
| cronologia  | `prev`, `previous`, `history`, `recent`, `last`        |
| artista     | `artist`, `performer`, `ARTIST`, `artistName`          |
| titolo      | `title`, `song`, `track`, `TITLE`, `name`              |
| copertina   | `cover`, `art`, `artwork`, `image`, `picture`          |

Se il formato del tuo endpoint differisse, basta adattare la funzione
`parseRadioBoss` in `src/api/radioboss.ts`.

> **Nota CORS:** se l'endpoint RadioBoss non invia gli header CORS, abilitali
> lato server oppure inoltra la richiesta tramite un proxy (in sviluppo puoi
> configurare `server.proxy` in `vite.config.ts`).

---

## Build di produzione

```bash
# Compila TypeScript e genera il bundle ottimizzato in dist/
npm run build

# Anteprima locale del build di produzione
npm run preview
```

Il contenuto della cartella **`dist/`** è statico: può essere pubblicato su
qualunque hosting (Netlify, Vercel, Cloudflare Pages, Nginx, ecc.).

> Per lo hosting statico con routing lato client, configura un fallback a
> `index.html` per tutte le rotte (es. `try_files ... /index.html` su Nginx).

---

## Struttura del progetto

```
radiodjtoto/
├── index.html                 # HTML di base + font
├── vite.config.ts             # configurazione Vite
├── tsconfig*.json             # configurazione TypeScript
├── public/
│   ├── favicon.svg
│   └── cover-placeholder.svg  # copertina di fallback
└── src/
    ├── main.tsx               # entry point + provider
    ├── App.tsx                # rotte
    ├── config.ts              # >>> URL RadioBoss + stream, social, contatti
    ├── vite-env.d.ts          # tipi per CSS Modules
    ├── styles/
    │   └── global.css         # design tokens e stili globali
    ├── types/
    │   └── radio.ts           # modello dati normalizzato
    ├── api/
    │   ├── radioboss.ts       # fetch + parsing tollerante + gestione errori
    │   └── mock.ts            # dati demo (classici napoletani)
    ├── hooks/
    │   ├── useNowPlaying.ts   # polling automatico del now playing
    │   └── useAudioPlayer.ts  # controllo dello stream audio
    ├── context/
    │   └── PlayerContext.tsx  # stato globale (audio + dati live)
    ├── lib/
    │   └── format.ts          # helper per durate e orari
    ├── components/
    │   ├── common/            # Icone, Spinner, ErrorMessage, TrackCover
    │   ├── layout/            # Header, Footer, Layout
    │   ├── player/            # LivePlayer (barra fissa) + VolumeControl
    │   ├── nowplaying/        # NowPlaying (in onda ora)
    │   └── tracklist/         # TrackList (coda e cronologia)
    └── pages/
        ├── Home.tsx           # now playing + coda + cronologia
        ├── About.tsx          # Chi siamo
        ├── Contact.tsx        # Contatti (form demo)
        ├── Schedule.tsx       # Palinsesto / Programmi
        └── NotFound.tsx       # 404
```

---

## Funzionalità principali

- **Player live sempre accessibile** — barra fissa in basso con play/pause,
  volume e mute; l'audio non si interrompe navigando tra le pagine.
- **Now Playing automatico** — copertina, titolo e artista aggiornati via
  polling; il polling si sospende quando la scheda è nascosta.
- **Coda e cronologia** — brani successivi e precedenti recuperati dall'API.
- **Stati di caricamento ed errore** — spinner al primo caricamento, messaggi
  di errore con “Riprova”, e nessuno sfarfallio: in caso di errore transitorio
  resta visibile l'ultimo stato valido.
- **Accessibilità** — focus visibile, ruoli ARIA, rispetto di
  `prefers-reduced-motion`, testi alternativi.

---

## Personalizzazione rapida

- **Colori / tipografia:** variabili in cima a `src/styles/global.css`.
- **Social e contatti:** oggetto `config` in `src/config.ts`.
- **Palinsesto:** array `weekdayPrograms` / `weekendPrograms` in
  `src/pages/Schedule.tsx`.
- **Frequenza di aggiornamento:** `POLL_INTERVAL_MS` in `src/config.ts`.

---

© RadioDJToto — radiodjtoto.it
