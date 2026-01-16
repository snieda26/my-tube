'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'
import { getVideoUrl, getThumbnailUrl } from '@/common/utils/storage'
import { formatDuration } from '@/common/utils/format'
import { VideoQuality } from '../../types/video.types'

interface VideoPlayerProps {
  src: string
  poster?: string
  availableQualities?: VideoQuality[]
  autoPlay?: boolean
}

export default function VideoPlayer({
  src,
  poster,
  availableQualities = ['720p'],
  autoPlay = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState<VideoQuality>(() => {
    // Get highest available quality
    const order: VideoQuality[] = ['1080p', '720p', '480p', '360p']
    return order.find((q) => availableQualities.includes(q)) || '720p'
  })
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [buffered, setBuffered] = useState(0)

  // Generate video URL based on quality
  const videoUrl = getVideoUrl(src, quality)
  const posterUrl = getThumbnailUrl(poster)

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch(console.error)
    }
  }, [isPlaying])

  // Handle progress bar click
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressBarRef.current
      const video = videoRef.current
      if (!bar || !video || !duration) return

      const rect = bar.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration

      video.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration]
  )

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    const video = videoRef.current

    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    if (video) {
      video.volume = newVolume
      video.muted = newVolume === 0
    }
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const newMuted = !isMuted
    setIsMuted(newMuted)
    video.muted = newMuted
  }, [isMuted])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen().catch(console.error)
    }
  }, [])

  // Handle quality change
  const handleQualityChange = useCallback(
    (newQuality: VideoQuality) => {
      if (newQuality === quality) {
        setShowQualityMenu(false)
        return
      }

      const video = videoRef.current
      if (!video) return

      const wasPlaying = isPlaying
      const savedTime = currentTime

      setQuality(newQuality)
      setShowQualityMenu(false)

      // Wait for src to update, then restore position
      setTimeout(() => {
        if (video) {
          video.currentTime = savedTime
          if (wasPlaying) {
            video.play().catch(console.error)
          }
        }
      }, 100)
    },
    [quality, isPlaying, currentTime]
  )

  // Show/hide controls on mouse movement
  const handleMouseMove = useCallback(() => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => setDuration(video.duration)
    const onEnded = () => setIsPlaying(false)
    const onProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        setBuffered((bufferedEnd / video.duration) * 100)
      }
    }
    const onCanPlay = () => {
      setIsLoading(false)
      // Autoplay when video is ready
      if (autoPlay && video.paused) {
        video.play().catch(console.error)
      }
    }
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('ended', onEnded)
    video.addEventListener('progress', onProgress)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('progress', onProgress)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
    }
  }, [autoPlay])

  // Fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'arrowleft':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime -= 5
          }
          break
        case 'arrowright':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime += 5
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleFullscreen, toggleMute])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={`video-player ${showControls ? 'video-player--controls-visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="video-player__video-wrapper">
        <video
          ref={videoRef}
          className="video-player__video"
          src={videoUrl}
          onClick={togglePlay}
          playsInline
        />

        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="video-player__loading">
            <div className="video-player__spinner" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`video-player__controls ${showControls ? 'video-player__controls--visible' : ''}`}>
        {/* Progress Bar */}
        <div ref={progressBarRef} className="video-player__progress" onClick={handleProgressClick}>
          <div className="video-player__progress-buffer" style={{ width: `${buffered}%` }} />
          <div className="video-player__progress-filled" style={{ width: `${progressPercent}%` }}>
            <div className="video-player__progress-thumb" />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="video-player__buttons">
          <div className="video-player__left-controls">
            {/* Play/Pause */}
            <button className="video-player__btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <HiPause /> : <HiPlay />}
            </button>

            {/* Volume */}
            <div className="video-player__volume">
              <button className="video-player__btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted || volume === 0 ? <HiVolumeOff /> : <HiVolumeUp />}
              </button>
              <input
                type="range"
                className="video-player__slider video-player__volume-slider"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) 100%)`,
                }}
              />
            </div>

            {/* Time */}
            <div className="video-player__time">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </div>
          </div>

          <div className="video-player__right-controls">
            {/* Quality Selector */}
            {availableQualities.length > 1 && (
              <div className="video-player__quality">
                <button className="video-player__btn" onClick={() => setShowQualityMenu(!showQualityMenu)}>
                  {quality}
                </button>
                {showQualityMenu && (
                  <div className="video-player__quality-menu video-player__quality-menu--open">
                    {availableQualities.map((q) => (
                      <button
                        key={q}
                        className={`video-player__quality-option ${quality === q ? 'video-player__quality-option--active' : ''}`}
                        onClick={() => handleQualityChange(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button
              className="video-player__btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
