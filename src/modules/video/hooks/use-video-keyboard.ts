import { useEffect, useCallback } from 'react'
import { VIDEO_PLAYER_CONSTANTS } from '../constants/video.constants'

interface UseVideoKeyboardOptions {
  onTogglePlay: () => void
  onToggleFullscreen: () => void
  onToggleTheaterMode: () => void
  onToggleMute: () => void
  onSeekRelative: (delta: number) => void
  onAdjustVolume: (delta: number) => void
}

export function useVideoKeyboard(options: UseVideoKeyboardOptions) {
  const {
    onTogglePlay,
    onToggleFullscreen,
    onToggleTheaterMode,
    onToggleMute,
    onSeekRelative,
    onAdjustVolume,
  } = options

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const activeElement = document.activeElement
    const isInputFocused = 
      activeElement?.tagName === 'INPUT' || 
      activeElement?.tagName === 'TEXTAREA'

    if (isInputFocused) return

    const key = e.key.toLowerCase()

    const keyActions: Record<string, () => void> = {
      ' ': onTogglePlay,
      'k': onTogglePlay,
      'f': onToggleFullscreen,
      't': onToggleTheaterMode,
      'm': onToggleMute,
      'arrowleft': () => onSeekRelative(-VIDEO_PLAYER_CONSTANTS.SEEK_STEP_SECONDS),
      'arrowright': () => onSeekRelative(VIDEO_PLAYER_CONSTANTS.SEEK_STEP_SECONDS),
      'arrowup': () => onAdjustVolume(VIDEO_PLAYER_CONSTANTS.VOLUME_STEP),
      'arrowdown': () => onAdjustVolume(-VIDEO_PLAYER_CONSTANTS.VOLUME_STEP),
    }

    const action = keyActions[key]
    if (action) {
      e.preventDefault()
      action()
    }
  }, [onTogglePlay, onToggleFullscreen, onToggleTheaterMode, onToggleMute, onSeekRelative, onAdjustVolume])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
}
