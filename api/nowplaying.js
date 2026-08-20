/* =========================================================================
   Funzione serverless (Vercel) — "now playing" da RadioBOSS Cloud.
   -------------------------------------------------------------------------
   Chiama l'API di RadioBOSS Cloud lato server, così la API key resta segreta
   (in variabili d'ambiente Vercel) e non ci sono problemi di CORS: il sito
   legge questo endpoint sulla propria stessa origine (/api/nowplaying).

   Variabili d'ambiente da impostare su Vercel (Settings → Environment
   Variables):
     RADIOBOSS_STATION_ID  → l'ID numerico della stazione (dal pannello)
     RADIOBOSS_API_KEY     → la API key (dal pannello)
     RADIOBOSS_HOST        → opzionale, default https://c26.radioboss.fm

   Restituisce il formato { current, next[], prev[] } già pronto per il sito.
   ========================================================================= */

const HOST = process.env.RADIOBOSS_HOST || 'https://c26.radioboss.fm';

/** Estrae un brano normalizzato da un blocco *_info dell'API. */
function trackFrom(info, cover) {
  const a = info && info['@attributes'] ? info['@attributes'] : null;
  if (!a) return null;
  const artist = (a.ARTIST || '').trim();
  const title = (a.TITLE || '').trim();
  if (!artist && !title) return null;
  return {
    id: `${artist}-${title}`,
    artist: artist || 'RadioDJToto',
    title: title || (a.CASTTITLE || '').trim() || 'Senza titolo',
    cover: cover || undefined,
  };
}

export default async function handler(req, res) {
  const id = process.env.RADIOBOSS_STATION_ID;
  const key = process.env.RADIOBOSS_API_KEY;

  if (!id || !key) {
    res.status(500).json({ error: 'Configurazione mancante: STATION_ID/API_KEY.' });
    return;
  }

  try {
    const r = await fetch(`${HOST}/api/info/${id}?key=${key}`, {
      headers: { Accept: 'application/json' },
    });
    if (!r.ok) {
      res.status(502).json({ error: `RadioBOSS API HTTP ${r.status}` });
      return;
    }

    const d = await r.json();
    const links = d.links || {};

    const current = trackFrom(d.currenttrack_info, links.artwork);
    const next = trackFrom(d.nexttrack_info, links.artwork_next);

    // "recent" include anche il brano corrente come primo elemento:
    // lo escludiamo dalla cronologia dei "già trasmessi".
    const npTitle = d.nowplaying;
    const prev = (Array.isArray(d.recent) ? d.recent : [])
      .filter((rec) => rec && rec.title && rec.title !== npTitle)
      .slice(0, 6)
      .map((rec) => ({
        id: `${rec.trackartist}-${rec.tracktitle}-${rec.started}`,
        artist: rec.trackartist || 'Sconosciuto',
        title: rec.tracktitle || rec.title,
        cover:
          links.artwork_recent && rec.artworkid
            ? links.artwork_recent.replace('ARTID', rec.artworkid)
            : undefined,
        playedAt: rec.started,
      }));

    // Cache breve lato CDN per non martellare l'API ad ogni visita.
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.status(200).json({
      current,
      next: next ? [next] : [],
      prev,
    });
  } catch (err) {
    res.status(502).json({ error: 'Impossibile contattare RadioBOSS Cloud.' });
  }
}
