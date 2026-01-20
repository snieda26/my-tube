'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'
import Avatar from '@/common/components/ui/avatar/Avatar'
import Button from '@/common/components/ui/button/Button'
import Skeleton from '@/common/components/ui/skeleton/Skeleton'
import { useVideo, useToggleLike, useRecordView } from '@/modules/video'
import { formatViews } from '@/common/utils/format'
import { API_CONFIG } from '@/modules/auth/config/api.config'

export default function WatchPage() {
  const searchParams = useSearchParams()
  const publicId = searchParams.get('v') || ''

  const { data: video, isLoading } = useVideo(publicId)
  const toggleLike = useToggleLike()
  const recordView = useRecordView()

  // Record view after 5 seconds
  useEffect(() => {
    if (video?.id) {
      const timer = setTimeout(() => {
        recordView.mutate(video.id)
      }, 5000)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id])

  const handleLike = () => {
    if (video) {
      toggleLike.mutate(video.id)
    }
  }

  if (isLoading) {
    return (
      <div className="watch-page">
        <div className="watch-page__main">
          <Skeleton variant="thumbnail" />
          <Skeleton variant="title" />
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="watch-page">
        <div className="watch-page__main">
          <div className="video-player">
            <div className="video-player__placeholder">Video not found</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="watch-page">
      <div className="watch-page__main">
        <div className="video-player">
          <div className="video-player__video-wrapper">
            <video
              className="video-player__video"
              src={`${API_CONFIG.baseURL}${video.videoFileName}`}
              poster={`${API_CONFIG.baseURL}${video.thumbnailPath}`}
              controls
            />
          </div>
        </div>

        <div className="video-info">
          <h1 className="video-info__title">{video.title}</h1>

          <div className="video-info__meta">
            <div className="video-info__stats">
              <span>{formatViews(video.views)} views</span>
              <span>
                {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
              </span>
            </div>

            <div className="video-info__actions">
              <button
                className={`video-info__action ${video.isLiked ? 'video-info__action--active' : ''}`}
                onClick={handleLike}
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
              src={video.channel.avatarPath ? `${API_CONFIG.baseURL}${video.channel.avatarPath}` : null}
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

          <Button variant={video.channel.isSubscribed ? 'secondary' : 'primary'}>
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
            <textarea
              className="comments-section__input"
              placeholder="Add a comment..."
              rows={2}
            />
            <Button type="button" variant="primary">
              Comment
            </Button>
          </form>

          <div className="comments-section__list">
          </div>
        </div>
      </div>

      <div className="watch-page__sidebar">
        <div className="similar-videos">
          <h3 className="similar-videos__header">Similar Videos</h3>
          <div className="similar-videos__list">
          </div>
        </div>
      </div>
    </div>
  )
}
