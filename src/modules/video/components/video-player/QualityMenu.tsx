import { HiCog } from 'react-icons/hi'
import { VideoQuality } from '../../types/video.types'

interface QualityMenuProps {
  availableQualities: string[]
  currentQuality: VideoQuality
  isOpen: boolean
  onToggle: () => void
  onQualityChange: (quality: VideoQuality) => void
}

export function QualityMenu({
  availableQualities,
  currentQuality,
  isOpen,
  onToggle,
  onQualityChange,
}: QualityMenuProps) {
  if (availableQualities.length <= 1) {
    return null
  }

  return (
    <div className="video-player__quality">
      <button
        className="video-player__btn"
        onClick={onToggle}
        aria-label="Quality settings"
      >
        <HiCog />
      </button>
      <div className={`video-player__quality-menu ${isOpen ? 'video-player__quality-menu--open' : ''}`}>
        {availableQualities.map((q) => (
          <button
            key={q}
            className={`video-player__quality-option ${currentQuality === q ? 'video-player__quality-option--active' : ''}`}
            onClick={() => onQualityChange(q as VideoQuality)}
          >
            {q}
            {currentQuality === q && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  )
}
