import { useRef, useCallback } from 'react'

interface ProgressBarProps {
  currentTime: number
  duration: number
  buffered: number
  progressPercent: number
  onSeek: (time: number) => void
}

export function ProgressBar({
  duration,
  buffered,
  progressPercent,
  onSeek,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const progressBar = progressBarRef.current
      if (!progressBar) return

      const rect = progressBar.getBoundingClientRect()
      const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const newTime = position * duration

      onSeek(newTime)
    },
    [duration, onSeek]
  )

  return (
    <div
      ref={progressBarRef}
      className="video-player__progress"
      onClick={handleClick}
    >
      <div 
        className="video-player__progress-buffer" 
        style={{ width: `${buffered}%` }} 
      />
      <div 
        className="video-player__progress-filled" 
        style={{ width: `${progressPercent}%` }}
      >
        <div className="video-player__progress-thumb" />
      </div>
    </div>
  )
}
