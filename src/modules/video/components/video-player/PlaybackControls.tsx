import { HiPlay, HiPause, HiDesktopComputer } from 'react-icons/hi'
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'
import { VideoQuality } from '../../types/video.types'
import { formatDuration } from '@/common/utils/format'
import { VolumeControl } from './VolumeControl'
import { QualityMenu } from './QualityMenu'

interface PlaybackControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  isTheaterMode: boolean
  availableQualities: string[]
  currentQuality: VideoQuality
  showQualityMenu: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
  onVolumeChange: (volume: number) => void
  onToggleFullscreen: () => void
  onToggleTheaterMode: () => void
  onToggleQualityMenu: () => void
  onQualityChange: (quality: VideoQuality) => void
}

export function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  availableQualities,
  currentQuality,
  showQualityMenu,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
  onToggleTheaterMode,
  onToggleQualityMenu,
  onQualityChange,
}: PlaybackControlsProps) {
  return (
    <div className="video-player__buttons">
      <div className="video-player__left-controls">
        <button
          className="video-player__btn"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <HiPause /> : <HiPlay />}
        </button>

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />

        <div className="video-player__time">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>
      </div>

      <div className="video-player__right-controls">
        <QualityMenu
          availableQualities={availableQualities}
          currentQuality={currentQuality}
          isOpen={showQualityMenu}
          onToggle={onToggleQualityMenu}
          onQualityChange={onQualityChange}
        />

        <button
          className="video-player__btn"
          onClick={onToggleTheaterMode}
          aria-label="Theater mode"
        >
          <HiDesktopComputer />
        </button>

        <button
          className="video-player__btn"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
        </button>
      </div>
    </div>
  )
}
