import { useRef, useState, useEffect, useCallback } from 'react'
import { VideoQuality } from '../types/video.types'
import { VIDEO_PLAYER_CONSTANTS, QUALITY_PRIORITY } from '../constants/video.constants'

interface UseVideoPlayerOptions {
  autoPlay?: boolean
  availableQualities?: string[]
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
}

interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  buffered: number
  isLoading: boolean
  quality: VideoQuality
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const {
    autoPlay = true,
    availableQualities = ['720p'],
    onTimeUpdate,
    onEnded,
  } = options

  const videoRef = useRef<HTMLVideoElement>(null)

  const getDefaultQuality = useCallback((): VideoQuality => {
    for (const q of QUALITY_PRIORITY) {
      if (availableQualities.includes(q)) {
        return q as VideoQuality
      }
    }
    return '720p'
  }, [availableQualities])

  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    isLoading: true,
    quality: getDefaultQuality(),
  })

  const [playAnimation, setPlayAnimation] = useState<'play' | 'pause' | null>(null)

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

    setTimeout(() => setPlayAnimation(null), VIDEO_PLAYER_CONSTANTS.PLAY_ANIMATION_DURATION)
  }, [])

  const seek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(time, state.duration))
    setState(prev => ({ ...prev, currentTime: video.currentTime }))
  }, [state.duration])

  const seekRelative = useCallback((delta: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.currentTime + delta, state.duration))
  }, [state.duration])

  const setQuality = useCallback((newQuality: VideoQuality) => {
    const video = videoRef.current
    if (!video) return

    const wasPlaying = !video.paused
    const savedTime = video.currentTime

    setState(prev => ({ ...prev, quality: newQuality }))

    const handleLoadedData = () => {
      video.currentTime = savedTime
      if (wasPlaying) {
        video.play().catch(err => console.error('Failed to resume playback:', err))
      }
      video.removeEventListener('loadeddata', handleLoadedData)
    }

    video.addEventListener('loadeddata', handleLoadedData)
  }, [])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlers = {
      play: () => setState(prev => ({ ...prev, isPlaying: true })),
      pause: () => setState(prev => ({ ...prev, isPlaying: false })),
      timeupdate: () => {
        setState(prev => ({ ...prev, currentTime: video.currentTime }))
        onTimeUpdate?.(video.currentTime, video.duration)
      },
      loadedmetadata: () => {
        setState(prev => ({ ...prev, duration: video.duration, isLoading: false }))
      },
      progress: () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1)
          setState(prev => ({ ...prev, buffered: (bufferedEnd / video.duration) * 100 }))
        }
      },
      ended: () => {
        setState(prev => ({ ...prev, isPlaying: false }))
        onEnded?.()
      },
      waiting: () => setState(prev => ({ ...prev, isLoading: true })),
      canplay: () => setState(prev => ({ ...prev, isLoading: false })),
    }

    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler)
    })

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler)
      })
    }
  }, [onTimeUpdate, onEnded])

  // Autoplay handling
  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoPlay) return

    const attemptAutoplay = async () => {
      try {
        await video.play()
        setState(prev => ({ ...prev, isPlaying: true }))
      } catch {
        video.muted = true
        try {
          await video.play()
          setState(prev => ({ ...prev, isPlaying: true }))
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
  }, [autoPlay])

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0

  return {
    videoRef,
    state,
    playAnimation,
    progressPercent,
    actions: {
      togglePlay,
      seek,
      seekRelative,
      setQuality,
    },
  }
}
