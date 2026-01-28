import { HiPlay, HiPause } from 'react-icons/hi'

interface PlayAnimationProps {
  animation: 'play' | 'pause' | null
}

export function PlayAnimation({ animation }: PlayAnimationProps) {
  if (!animation) return null

  return (
    <div className="video-player__play-animation video-player__play-animation--animate">
      {animation === 'play' ? <HiPlay /> : <HiPause />}
    </div>
  )
}
