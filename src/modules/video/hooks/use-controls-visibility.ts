import { useState, useCallback, useRef, useEffect } from 'react'
import { VIDEO_PLAYER_CONSTANTS } from '../constants/video.constants'

interface UseControlsVisibilityOptions {
  isPlaying: boolean
}

export function useControlsVisibility({ isPlaying }: UseControlsVisibilityOptions) {
  const [showControls, setShowControls] = useState(true)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleMouseMove = useCallback(() => {
    setShowControls(true)

    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }

    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, VIDEO_PLAYER_CONSTANTS.CONTROLS_HIDE_DELAY)
  }, [isPlaying])

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setShowControls(false)
    }
    setShowQualityMenu(false)
  }, [isPlaying])

  const toggleQualityMenu = useCallback(() => {
    setShowQualityMenu(prev => !prev)
  }, [])

  const closeQualityMenu = useCallback(() => {
    setShowQualityMenu(false)
  }, [])

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
    }
  }, [])

  return {
    showControls,
    showQualityMenu,
    handleMouseMove,
    handleMouseLeave,
    toggleQualityMenu,
    closeQualityMenu,
  }
}
