import { useState, useCallback, RefObject } from 'react'
import { VIDEO_PLAYER_CONSTANTS } from '../constants/video.constants'

interface UseVideoVolumeOptions {
  videoRef: RefObject<HTMLVideoElement | null>
  initialMuted?: boolean
}

export function useVideoVolume({ videoRef, initialMuted = false }: UseVideoVolumeOptions) {
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(initialMuted)

  const setVolume = useCallback((newVolume: number) => {
    const video = videoRef.current
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    
    setVolumeState(clampedVolume)
    setIsMuted(clampedVolume === 0)

    if (video) {
      video.volume = clampedVolume
      video.muted = clampedVolume === 0
    }
  }, [videoRef])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const newMuted = !isMuted
    setIsMuted(newMuted)
    video.muted = newMuted

    if (!newMuted && volume === 0) {
      setVolumeState(VIDEO_PLAYER_CONSTANTS.DEFAULT_UNMUTE_VOLUME)
      video.volume = VIDEO_PLAYER_CONSTANTS.DEFAULT_UNMUTE_VOLUME
    }
  }, [isMuted, volume, videoRef])

  const adjustVolume = useCallback((delta: number) => {
    setVolume(volume + delta)
  }, [volume, setVolume])

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    adjustVolume,
  }
}
