'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import Avatar from '@/common/components/ui/avatar/Avatar'
import Button from '@/common/components/ui/button/Button'
import { VideoPlayer, useVideo, useToggleLike, useRecordView } from '@/modules/video'
import { getVideoUrl, getThumbnailUrl, getAvatarUrl } from '@/common/utils/storage'
import { formatCompactNumber, formatTimeAgo } from '@/common/utils/format'
import { VIEW_RECORDING } from '@/modules/video/constants/video.constants'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'

export default function WatchPage() {
  const searchParams = useSearchParams()
  const publicId = searchParams.get('v') || ''
  const viewRecordedRef = useRef(false)

  const { data: video, isLoading, error } = useVideo(publicId)
  const toggleLike = useToggleLike(publicId)
  const recordView = useRecordView()

  // Record view after delay - use ref to prevent multiple recordings
  useEffect(() => {
    if (!video?.id || viewRecordedRef.current) return

    const timer = setTimeout(() => {
      viewRecordedRef.current = true
      recordView.mutate(video.id)
    }, VIEW_RECORDING.DELAY_MS)

    return () => clearTimeout(timer)
  }, [video?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset view recording flag when video changes
  useEffect(() => {
    viewRecordedRef.current = false
  }, [publicId])

  const handleLike = () => {
    if (video) {
      toggleLike.mutate(video.id)
    }
  }

  if (isLoading) {
    return (
      <div className="watch-page">
        <div className="watch-page__main">
          <div className="video-player">
            <div className="video-player__video-wrapper">
              <div className="video-player__loading-overlay">
                <div className="video-player__spinner" />
              </div>
            </div>
          </div>
          <div className="video-info">
            <div className="skeleton skeleton--title" style={{ height: '28px', width: '60%' }} />
            <div className="skeleton skeleton--text" style={{ height: '16px', width: '30%', marginTop: '12px' }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    const errorMessage = error
      ? 'Failed to load video. Make sure the backend server is running at ' +
        (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200')
      : 'Video not found'

    return (
      <div className="watch-page">
        <div className="watch-page__main">
          <div className="video-player">
            <div className="video-player__placeholder">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ marginBottom: '16px' }}>{errorMessage}</p>
                <p style={{ fontSize: '14px', color: '#888' }}>
                  Video ID: {publicId || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const videoSrc = getVideoUrl(video.videoFileName)
  const posterSrc = getThumbnailUrl(video.thumbnailPath)
  const channelAvatar = getAvatarUrl(video.channel.avatarPath)

  return (
    <div className="watch-page">
      <div className="watch-page__main">
        <VideoPlayer
          src={videoSrc}
          poster={posterSrc}
          availableQualities={video.availableQualities}
        />

        <div className="video-info">
          <h1 className="video-info__title">{video.title}</h1>

          <div className="video-info__meta">
            <div className="video-info__stats">
              <span>{formatCompactNumber(video.views)} views</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>

            <div className="video-info__actions">
              <button
                className={`video-info__action ${video.isLiked ? 'video-info__action--active' : ''}`}
                onClick={handleLike}
                disabled={toggleLike.isPending}
              >
                {video.isLiked ? <HiHeart /> : <HiOutlineHeart />}
                <span>{video.likesCount}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="channel-info">
          <div className="channel-info__left">
            <Avatar
              src={channelAvatar || null}
              alt={video.channel.owner.name || video.channel.handle}
              size="lg"
            />
            <div className="channel-info__details">
              <a href={`/channel/${video.channel.handle}`} className="channel-info__name">
                {video.channel.owner.name || video.channel.handle}
              </a>
              <span className="channel-info__subscribers">
                {formatCompactNumber(video.subscribersCount)} subscribers
              </span>
            </div>
          </div>

          <Button
            variant={video.channel.isSubscribed ? 'secondary' : 'primary'}
          >
            {video.channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>

        <div className="video-description">
          <div className="video-description__content">
            {video.description || 'No description'}
          </div>
        </div>

        <div className="comments-section">
          <div className="comments-section__header">
            <h3>Comments</h3>
            <span>{video.commentsCount}</span>
          </div>

          <form className="comments-section__form">
            <textarea className="comments-section__input" placeholder="Add a comment..." rows={2} />
            <Button type="button" variant="primary">
              Comment
            </Button>
          </form>

          <div className="comments-section__list"></div>
        </div>
      </div>

      <div className="watch-page__sidebar">
        <div className="similar-videos">
          <h3 className="similar-videos__header">Similar Videos</h3>
          <div className="similar-videos__list"></div>
        </div>
      </div>
    </div>
  )
}
