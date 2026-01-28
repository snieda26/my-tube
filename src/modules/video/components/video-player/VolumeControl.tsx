import { useCallback } from 'react'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onVolumeChange(parseFloat(e.target.value))
    },
    [onVolumeChange]
  )

  const displayVolume = isMuted ? 0 : volume
  const sliderBackground = `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${displayVolume * 100}%, rgba(255, 255, 255, 0.3) ${displayVolume * 100}%, rgba(255, 255, 255, 0.3) 100%)`

  return (
    <div className="video-player__volume">
      <button
        className="video-player__btn"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? <HiVolumeOff /> : <HiVolumeUp />}
      </button>
      <input
        type="range"
        className="video-player__volume-slider video-player__slider"
        min="0"
        max="1"
        step="0.05"
        value={displayVolume}
        onChange={handleChange}
        aria-label="Volume"
        style={{ background: sliderBackground }}
      />
    </div>
  )
}
