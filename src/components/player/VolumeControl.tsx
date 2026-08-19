import { MuteIcon, VolumeIcon } from '../common/Icons';
import styles from './VolumeControl.module.css';

interface Props {
  volume: number;
  isMuted: boolean;
  onVolume: (v: number) => void;
  onToggleMute: () => void;
}

/** Controllo volume: pulsante mute + slider accessibile. */
export function VolumeControl({ volume, isMuted, onVolume, onToggleMute }: Props) {
  const shown = isMuted ? 0 : volume;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.muteBtn}
        onClick={onToggleMute}
        aria-label={isMuted ? 'Riattiva audio' : 'Disattiva audio'}
        aria-pressed={isMuted}
      >
        {isMuted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
      </button>

      <input
        className={styles.slider}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={shown}
        onChange={(e) => onVolume(Number(e.target.value))}
        aria-label="Volume"
        style={{ ['--pct' as string]: `${shown * 100}%` }}
      />
    </div>
  );
}
