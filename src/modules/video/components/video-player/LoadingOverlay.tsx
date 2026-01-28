interface LoadingOverlayProps {
  isLoading: boolean
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <div
      className={`video-player__loading-overlay ${!isLoading ? 'video-player__loading-overlay--hidden' : ''}`}
    >
      <div className="video-player__spinner" />
    </div>
  )
}
