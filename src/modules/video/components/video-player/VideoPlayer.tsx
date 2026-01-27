'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiDesktopComputer,
  HiCog,
} from 'react-icons/hi'
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'
import { getVideoUrl } from '@/common/utils/storage'

type VideoQuality = '360p' | '480p' | '720p' | '1080p' | '2k' | '4k'

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
  onEnded 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const getDefaultQuality = (): VideoQuality => {
    const qualityOrder: VideoQuality[] = ['4k', '2k', '1080p', '720p', '480p', '360p']
    for (const q of qualityOrder) {
      if (availableQualities.includes(q)) {
        return q
      }
    }
    return '720p'
  }

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(autoPlay)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playAnimation, setPlayAnimation] = useState<'play' | 'pause' | null>(null)
  const [quality, setQuality] = useState<VideoQuality>(getDefaultQuality())
  const [showQualityMenu, setShowQualityMenu] = useState(false)

  const getQualityVideoUrl = useCallback((baseUrl: string, selectedQuality: VideoQuality) => {
    if (baseUrl.startsWith('http')) {
      const url = new URL(baseUrl)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts.pop() || ''
      return getVideoUrl(fileName, selectedQuality)
    }
    const fileName = baseUrl.split('/').pop() || baseUrl
    return getVideoUrl(fileName, selectedQuality)
  }, [])

  const currentVideoUrl = availableQualities.length > 1 
    ? getQualityVideoUrl(src, quality)
    : src

  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'

    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setPlayAnimation('play')
    } else {
      video.pause()
      setPlayAnimation('pause')
    }

    setTimeout(() => setPlayAnimation(null), 400)
  }, [])

  const handleProgressBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const progressBar = progressBarRef.current
      const video = videoRef.current
      if (!progressBar || !video) return

      const rect = progressBar.getBoundingClientRect()
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const newTime = pos * duration

      video.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration]
  )

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    if (videoRef.current) {
      videoRef.current.volume = newVolume
      videoRef.current.muted = newVolume === 0
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const newMuted = !isMuted
    setIsMuted(newMuted)
    video.muted = newMuted

    if (!newMuted && volume === 0) {
      setVolume(0.5)
      video.volume = 0.5
    }
  }, [isMuted, volume])

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode((prev) => !prev)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)

    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }

    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setShowControls(false)
    }
    setShowQualityMenu(false)
  }, [isPlaying])

  const handleQualityChange = useCallback((newQuality: VideoQuality) => {
    const video = videoRef.current
    if (!video) return

    const wasPlaying = !video.paused
    const savedTime = video.currentTime

    setQuality(newQuality)
    setShowQualityMenu(false)

    const handleLoadedData = () => {
      video.currentTime = savedTime
      if (wasPlaying) {
        video.play().catch((err) => console.error('Failed to resume playback:', err))
      }
      video.removeEventListener('loadeddata', handleLoadedData)
    }

    video.addEventListener('loadeddata', handleLoadedData)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime, video.duration)
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        setBuffered((bufferedEnd / video.duration) * 100)
      }
    }
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [onTimeUpdate, onEnded])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoPlay) return

    const attemptAutoplay = async () => {
      try {
        await video.play()
        setIsPlaying(true)
      } catch {
        video.muted = true
        setIsMuted(true)
        try {
          await video.play()
          setIsPlaying(true)
        } catch {
          // Autoplay blocked
        }
      }
    }

    if (video.readyState >= 3) {
      attemptAutoplay()
    } else {
      video.addEventListener('canplay', attemptAutoplay, { once: true })
    }

    return () => {
      video.removeEventListener('canplay', attemptAutoplay)
    }
  }, [autoPlay, currentVideoUrl])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const activeElement = document.activeElement
      const isInputFocused =
        activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA'

      if (isInputFocused) return

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
        case 't':
          e.preventDefault()
          toggleTheaterMode()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'arrowleft':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
          }
          break
        case 'arrowright':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(
              duration,
              videoRef.current.currentTime + 5
            )
          }
          break
        case 'arrowup':
          e.preventDefault()
          setVolume((prev) => {
            const newVol = Math.min(1, prev + 0.1)
            if (videoRef.current) videoRef.current.volume = newVol
            return newVol
          })
          break
        case 'arrowdown':
          e.preventDefault()
          setVolume((prev) => {
            const newVol = Math.max(0, prev - 0.1)
            if (videoRef.current) videoRef.current.volume = newVol
            return newVol
          })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [togglePlay, toggleFullscreen, toggleTheaterMode, toggleMute, duration])

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
    }
  }, [])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={`video-player ${isTheaterMode ? 'video-player--theater' : ''} ${
        isFullscreen ? 'video-player--fullscreen' : ''
      } ${showControls ? 'video-player--controls-visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-player__video-wrapper">
        <video
          ref={videoRef}
          className="video-player__video"
          src={currentVideoUrl}
          poster={poster}
          onClick={togglePlay}
          playsInline
          autoPlay={autoPlay}
          muted={autoPlay}
        />

        <div
          className={`video-player__loading-overlay ${!isLoading ? 'video-player__loading-overlay--hidden' : ''}`}
        >
          <div className="video-player__spinner" />
        </div>

        {playAnimation && (
          <div className="video-player__play-animation video-player__play-animation--animate">
            {playAnimation === 'play' ? <HiPlay /> : <HiPause />}
          </div>
        )}
      </div>

      <div className="video-player__controls">
        <div
          ref={progressBarRef}
          className="video-player__progress"
          onClick={handleProgressBarClick}
        >
          <div className="video-player__progress-buffer" style={{ width: `${buffered}%` }} />
          <div className="video-player__progress-filled" style={{ width: `${progressPercent}%` }}>
            <div className="video-player__progress-thumb" />
          </div>
        </div>

        <div className="video-player__buttons">
          <div className="video-player__left-controls">
            <button
              className="video-player__btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <HiPause /> : <HiPlay />}
            </button>

            <div className="video-player__volume">
              <button
                className="video-player__btn"
                onClick={toggleMute}
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
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) 100%)`,
                }}
              />
            </div>

            <div className="video-player__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="video-player__right-controls">
            {availableQualities.length > 1 && (
              <div className="video-player__quality">
                <button
                  className="video-player__btn"
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  aria-label="Quality settings"
                >
                  <HiCog />
                </button>
                <div className={`video-player__quality-menu ${showQualityMenu ? 'video-player__quality-menu--open' : ''}`}>
                  {availableQualities.map((q) => (
                    <button
                      key={q}
                      className={`video-player__quality-option ${quality === q ? 'video-player__quality-option--active' : ''}`}
                      onClick={() => handleQualityChange(q as VideoQuality)}
                    >
                      {q}
                      {quality === q && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="video-player__btn"
              onClick={toggleTheaterMode}
              aria-label={isTheaterMode ? 'Exit theater mode' : 'Theater mode'}
            >
              <HiDesktopComputer />
            </button>

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
