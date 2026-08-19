import { createContext, useContext, type ReactNode } from 'react';
import { useAudioPlayer, type AudioPlayerApi } from '../hooks/useAudioPlayer';
import { useNowPlaying } from '../hooks/useNowPlaying';
import type { LoadStatus, NowPlayingState } from '../types/radio';

/* =========================================================================
   Context globale del player.
   Unisce il controllo audio (useAudioPlayer) e i dati live (useNowPlaying)
   in un unico provider, così la barra del player e le pagine condividono
   lo stesso stato senza duplicare il polling né interrompere l'audio durante
   la navigazione.
   ========================================================================= */

interface PlayerContextValue {
  audio: AudioPlayerApi;
  nowPlaying: NowPlayingState | null;
  status: LoadStatus;
  error: string | null;
  refresh: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audio = useAudioPlayer();
  const { data, status, error, refresh } = useNowPlaying();

  return (
    <PlayerContext.Provider
      value={{ audio, nowPlaying: data, status, error, refresh }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

/** Accesso tipizzato al context; errore esplicito se usato fuori dal provider. */
export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer deve essere usato dentro <PlayerProvider>.');
  }
  return ctx;
}
