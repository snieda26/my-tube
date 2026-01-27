'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Avatar from '@/common/components/ui/avatar/Avatar'
import Button from '@/common/components/ui/button/Button'
import { VideoPlayer, useVideo, useToggleLike, useRecordView } from '@/modules/video'
import { getVideoUrl, getThumbnailUrl, getAvatarUrl } from '@/common/utils/storage'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'

function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M`
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K`
  }
  return views.toString()
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export default function WatchPage() {
  const searchParams = useSearchParams()
  const publicId = searchParams.get('v') || ''

  const { data: video, isLoading, error } = useVideo(publicId)
  const toggleLike = useToggleLike()
  const recordView = useRecordView()

  useEffect(() => {
    if (video?.id) {
      const timer = setTimeout(() => {
        recordView.mutate(video.id)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [video?.id, recordView])

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
              <span>{formatViews(video.views)} views</span>
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
                {formatViews(video.subscribersCount)} subscribers
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
