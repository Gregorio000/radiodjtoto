import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../config';
import { fetchNowPlaying } from '../api/radioboss';
import type { LoadStatus, NowPlayingState, Track } from '../types/radio';

/* =========================================================================
   Hook di polling del "now playing".
   Aggiorna automaticamente brano corrente / coda / cronologia a intervalli
   regolari, gestendo stati di caricamento ed errore.
   - Non azzera i dati esistenti in caso di errore (evita sfarfallii): mostra
     l'ultimo stato valido e segnala l'errore separatamente.
   - Si mette in pausa quando la scheda è nascosta, per risparmiare richieste.
   ========================================================================= */

interface UseNowPlayingResult {
  data: NowPlayingState | null;
  status: LoadStatus;
  error: string | null;
  /** Forza un aggiornamento immediato. */
  refresh: () => void;
}

export function useNowPlaying(): UseNowPlayingResult {
  const [data, setData] = useState<NowPlayingState | null>(null);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Riferimenti stabili per timer e per annullare fetch in corso.
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isFirstLoad = useRef(true);

  // Cronologia costruita lato client quando il feed non la fornisce
  // (es. Icecast, che espone solo il brano corrente).
  const lastCurrentRef = useRef<Track | null>(null);
  const clientHistoryRef = useRef<Track[]>([]);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Mostra lo spinner solo al primo caricamento, non ad ogni polling.
    if (isFirstLoad.current) setStatus('loading');

    try {
      const next = await fetchNowPlaying(controller.signal);

      // Se il feed non porta una cronologia, la ricostruiamo noi: quando il
      // brano corrente cambia, quello precedente entra in "Appena trasmessi".
      if (next.history.length === 0) {
        const prev = lastCurrentRef.current;
        if (prev && next.current && prev.id !== next.current.id) {
          clientHistoryRef.current = [
            { ...prev, playedAt: new Date().toISOString() },
            ...clientHistoryRef.current.filter((t) => t.id !== prev.id),
          ].slice(0, config.MAX_HISTORY_ITEMS);
        }
        next.history = clientHistoryRef.current;
      }
      if (next.current) lastCurrentRef.current = next.current;

      setData(next);
      setStatus('success');
      setError(null);
      isFirstLoad.current = false;
    } catch (err) {
      if (controller.signal.aborted) return; // richiesta sostituita: ignora
      setError(err instanceof Error ? err.message : 'Errore sconosciuto.');
      // Se non abbiamo ancora dati validi, segnaliamo lo stato di errore.
      setStatus((prev) => (data ? prev : 'error'));
    }
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (!cancelled) void load();
    };

    tick(); // primo caricamento immediato

    const start = () => {
      if (timerRef.current == null) {
        timerRef.current = window.setInterval(tick, config.POLL_INTERVAL_MS);
      }
    };
    const stop = () => {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    start();

    // Sospende il polling quando la scheda non è visibile.
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        tick();
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      stop();
      abortRef.current?.abort();
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // Vogliamo avviare il ciclo una sola volta al mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, status, error, refresh: load };
}
