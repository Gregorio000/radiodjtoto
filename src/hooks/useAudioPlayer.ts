import { useCallback, useEffect, useRef, useState } from 'react';
import { config, isDemoMode } from '../config';

/* =========================================================================
   Hook di controllo del player audio live.
   Incapsula un singolo elemento <audio> creato via codice (così sopravvive
   alla navigazione tra pagine) ed espone play/pause, volume e mute.
   Gestisce gli stati "buffering" ed "errore" dello stream.
   ========================================================================= */

export type PlaybackStatus = 'idle' | 'buffering' | 'playing' | 'error';

export interface AudioPlayerApi {
  isPlaying: boolean;
  status: PlaybackStatus;
  volume: number; // 0..1
  isMuted: boolean;
  /** True quando non c'è uno stream configurato (modalità demo). */
  streamUnavailable: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

export function useAudioPlayer(): AudioPlayerApi {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const streamUnavailable = isDemoMode || config.AUDIO_STREAM_URL.trim() === '';

  // Crea l'elemento audio una sola volta.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;
    // Uno stream live non è "seekable": ricarichiamo la sorgente ad ogni play
    // per ripartire sempre dalla diretta.
    if (!streamUnavailable) {
      audio.src = config.AUDIO_STREAM_URL;
    }
    audioRef.current = audio;

    const onPlaying = () => {
      setIsPlaying(true);
      setStatus('playing');
    };
    const onWaiting = () => setStatus('buffering');
    const onPause = () => {
      setIsPlaying(false);
      setStatus('idle');
    };
    const onError = () => {
      setIsPlaying(false);
      setStatus('error');
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || streamUnavailable) {
      if (streamUnavailable) setStatus('error');
      return;
    }
    setStatus('buffering');
    // Ricarica per ripartire dalla diretta (niente riproduzione di buffer vecchio).
    audio.src = config.AUDIO_STREAM_URL;
    audio.load();
    audio.play().catch(() => setStatus('error'));
  }, [streamUnavailable]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      // Alzare il volume annulla il mute.
      if (clamped > 0 && audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !audio.muted;
    audio.muted = next;
    setIsMuted(next);
  }, []);

  return {
    isPlaying,
    status,
    volume,
    isMuted,
    streamUnavailable,
    toggle,
    play,
    pause,
    setVolume,
    toggleMute,
  };
}
