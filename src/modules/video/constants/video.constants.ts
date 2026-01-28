export const VIDEO_PLAYER_CONSTANTS = {
  /** Time in ms before controls auto-hide during playback */
  CONTROLS_HIDE_DELAY: 3000,
  /** Duration in ms for play/pause animation overlay */
  PLAY_ANIMATION_DURATION: 400,
  /** Default volume when unmuting from 0 */
  DEFAULT_UNMUTE_VOLUME: 0.5,
  /** Seconds to skip with arrow keys */
  SEEK_STEP_SECONDS: 5,
  /** Volume step for arrow key adjustments */
  VOLUME_STEP: 0.1,
} as const

export const VIEW_RECORDING = {
  /** Delay in ms before recording a view (prevents accidental views) */
  DELAY_MS: 5000,
} as const

/** Quality order from highest to lowest for default selection */
export const QUALITY_PRIORITY: readonly string[] = ['4k', '2k', '1080p', '720p', '480p', '360p']
