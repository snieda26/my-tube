'use client'

import { useRef } from 'react'
import { getVideoUrl } from '@/common/utils/storage'
import { VideoQuality } from '../../types/video.types'
import { useVideoPlayer } from '../../hooks/use-video-player'
import { useVideoVolume } from '../../hooks/use-video-volume'
import { useVideoFullscreen } from '../../hooks/use-video-fullscreen'
import { useVideoKeyboard } from '../../hooks/use-video-keyboard'
import { useControlsVisibility } from '../../hooks/use-controls-visibility'
import { ProgressBar } from './ProgressBar'
import { PlaybackControls } from './PlaybackControls'
import { LoadingOverlay } from './LoadingOverlay'
import { PlayAnimation } from './PlayAnimation'

interface VideoPlayerProps {
  src: string
  poster?: string
  availableQualities?: string[]
  autoPlay?: boolean
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
}

export default function VideoPlayer({
  src,
  poster,
  availableQualities = ['720p'],
  autoPlay = true,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    videoRef,
    state: playerState,
    playAnimation,
    progressPercent,
    actions: playerActions,
  } = useVideoPlayer({
    autoPlay,
    availableQualities,
    onTimeUpdate,
    onEnded,
  })

  const {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    adjustVolume,
  } = useVideoVolume({
    videoRef,
    initialMuted: autoPlay,
  })

  const {
    isFullscreen,
    isTheaterMode,
    toggleFullscreen,
    toggleTheaterMode,
  } = useVideoFullscreen(containerRef)

  const {
    showControls,
    showQualityMenu,
    handleMouseMove,
    handleMouseLeave,
    toggleQualityMenu,
    closeQualityMenu,
  } = useControlsVisibility({
    isPlaying: playerState.isPlaying,
  })

  useVideoKeyboard({
    onTogglePlay: playerActions.togglePlay,
    onToggleFullscreen: toggleFullscreen,
    onToggleTheaterMode: toggleTheaterMode,
    onToggleMute: toggleMute,
    onSeekRelative: playerActions.seekRelative,
    onAdjustVolume: adjustVolume,
  })

  const getQualityVideoUrl = (baseUrl: string, selectedQuality: VideoQuality): string => {
    if (baseUrl.startsWith('http')) {
      const url = new URL(baseUrl)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts.pop() || ''
      return getVideoUrl(fileName, selectedQuality)
    }
    const fileName = baseUrl.split('/').pop() || baseUrl
    return getVideoUrl(fileName, selectedQuality)
  }

  const currentVideoUrl = availableQualities.length > 1
    ? getQualityVideoUrl(src, playerState.quality)
    : src

  const handleQualityChange = (quality: VideoQuality) => {
    playerActions.setQuality(quality)
    closeQualityMenu()
  }

  const containerClasses = [
    'video-player',
    isTheaterMode && 'video-player--theater',
    isFullscreen && 'video-player--fullscreen',
    showControls && 'video-player--controls-visible',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-player__video-wrapper">
        <video
          ref={videoRef}
          className="video-player__video"
          src={currentVideoUrl}
          poster={poster}
          onClick={playerActions.togglePlay}
          playsInline
          autoPlay={autoPlay}
          muted={autoPlay}
        />

        <LoadingOverlay isLoading={playerState.isLoading} />
        <PlayAnimation animation={playAnimation} />
      </div>

      <div className="video-player__controls">
        <ProgressBar
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          buffered={playerState.buffered}
          progressPercent={progressPercent}
          onSeek={playerActions.seek}
        />

        <PlaybackControls
          isPlaying={playerState.isPlaying}
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          isTheaterMode={isTheaterMode}
          availableQualities={availableQualities}
          currentQuality={playerState.quality}
          showQualityMenu={showQualityMenu}
          onTogglePlay={playerActions.togglePlay}
          onToggleMute={toggleMute}
          onVolumeChange={setVolume}
          onToggleFullscreen={toggleFullscreen}
          onToggleTheaterMode={toggleTheaterMode}
          onToggleQualityMenu={toggleQualityMenu}
          onQualityChange={handleQualityChange}
        />
      </div>
    </div>
  )
}
