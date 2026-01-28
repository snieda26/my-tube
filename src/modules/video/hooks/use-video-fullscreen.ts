import { useState, useEffect, useCallback, RefObject } from 'react'

export function useVideoFullscreen(containerRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }, [containerRef])

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return {
    isFullscreen,
    isTheaterMode,
    toggleFullscreen,
    toggleTheaterMode,
  }
}
