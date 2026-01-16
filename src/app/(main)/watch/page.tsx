'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'
import Avatar from '@/common/components/ui/avatar/Avatar'
import Button from '@/common/components/ui/button/Button'
import Skeleton from '@/common/components/ui/skeleton/Skeleton'
import { useVideo, useToggleLike, useRecordView, VideoPlayer } from '@/modules/video'
import { useExploreVideos } from '@/modules/video/hooks/use-videos'
import VideoCard from '@/modules/video/components/video-card/VideoCard'
import type { Video } from '@/modules/video'
import { useComments, useCreateComment } from '@/modules/comments'
import { formatViews } from '@/common/utils/format'
import { getAvatarUrl } from '@/common/utils/storage'

export default function WatchPage() {
  const searchParams = useSearchParams()
  const publicId = searchParams.get('v') || ''

  const { data: video, isLoading, error } = useVideo(publicId)
  const { data: commentsData } = useComments(video?.id || '')
  const { data: similarVideos } = useExploreVideos(video ? [video.id] : undefined)
  const toggleLike = useToggleLike()
  const recordView = useRecordView()
  const createComment = useCreateComment()

  const [commentText, setCommentText] = useState('')

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !video) return

    createComment.mutate(
      { text: commentText, videoId: video.id },
      { onSuccess: () => setCommentText('') }
    )
  }

  if (isLoading) {
    return (
      <div className="watch-page">
        <div className="watch-page__main">
          <Skeleton variant="thumbnail" />
          <Skeleton variant="title" />
          <Skeleton variant="text" />
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="watch-page">
        <div className="watch-page__main">
          <div className="video-player">
            <div className="video-player__placeholder">
              {error ? 'Failed to load video' : 'Video not found'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="watch-page">
      <div className="watch-page__main">
        {/* Video Player */}
        <VideoPlayer
          src={video.videoFileName}
          poster={video.thumbnailPath}
          availableQualities={video.availableQualities}
          autoPlay
        />

        {/* Video Info */}
        <div className="video-info">
          <h1 className="video-info__title">{video.title}</h1>

          <div className="video-info__meta">
            <div className="video-info__stats">
              <span>{formatViews(video.views)} views</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
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

        {/* Channel Info */}
        <div className="channel-info">
          <div className="channel-info__left">
            <Avatar
              src={getAvatarUrl(video.channel.avatarPath)}
              alt={video.channel.owner.name || video.channel.handle}
              size="lg"
            />
            <div className="channel-info__details">
              <Link href={`/channel/${video.channel.handle}`} className="channel-info__name">
                {video.channel.owner.name || video.channel.handle}
              </Link>
              <span className="channel-info__subscribers">
                {formatViews(video.subscribersCount)} subscribers
              </span>
            </div>
          </div>

          <Button variant={video.channel.isSubscribed ? 'secondary' : 'primary'}>
            {video.channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>

        {/* Description */}
        <div className="video-description">
          <div className="video-description__content">{video.description || 'No description'}</div>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <div className="comments-section__header">
            <h3>Comments</h3>
            <span>{video.commentsCount}</span>
          </div>

          <form className="comments-section__form" onSubmit={handleCommentSubmit}>
            <textarea
              className="comments-section__input"
              placeholder="Add a comment..."
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!commentText.trim() || createComment.isPending}
            >
              {createComment.isPending ? 'Posting...' : 'Comment'}
            </Button>
          </form>

          <div className="comments-section__list">
            {commentsData?.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <Avatar
                  src={getAvatarUrl(comment.author.channel?.avatarPath)}
                  alt={comment.author.name || 'User'}
                  size="md"
                />
                <div className="comment__content">
                  <div className="comment__header">
                    <span className="comment__author">
                      {comment.author.name || comment.author.channel?.handle || 'Anonymous'}
                    </span>
                    <span className="comment__date">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="comment__text">{comment.text}</p>
                </div>
              </div>
            ))}

            {commentsData?.comments.length === 0 && (
              <p className="comments-section__empty">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      <div className="watch-page__sidebar">
        <div className="similar-videos">
          <h3 className="similar-videos__header">Similar Videos</h3>
          <div className="similar-videos__list">
            {similarVideos?.videos?.slice(0, 10).map((v: Video) => (
              <VideoCard key={v.id} video={v} variant="compact" />
            ))}

            {!similarVideos?.videos?.length && (
              <p className="similar-videos__empty">No similar videos found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
