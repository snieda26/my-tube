import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/common/components/ui/avatar/Avatar'
import { Video } from '../../types/video.types'
import { getThumbnailUrl, getAvatarUrl } from '@/common/utils/storage'
import { formatViews } from '@/common/utils/format'

interface VideoCardProps {
  video: Video
  variant?: 'default' | 'compact'
}

export default function VideoCard({ video, variant = 'default' }: VideoCardProps) {
  const thumbnailUrl = getThumbnailUrl(video.thumbnailPath)
  const avatarUrl = getAvatarUrl(video.channel.avatarPath)

  if (variant === 'compact') {
    return (
      <Link href={`/watch?v=${video.publicId}`} className="video-item">
        <div className="video-item__thumbnail">
          <img src={thumbnailUrl} alt={video.title} />
        </div>
        <div className="video-item__info">
          <h4 className="video-item__title">{video.title}</h4>
          <span className="video-item__channel">
            {video.channel.owner.name || video.channel.handle}
          </span>
          <div className="video-item__meta">
            <span>{formatViews(video.views)} views</span>
            <span> • </span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/watch?v=${video.publicId}`} className="video-card">
      <div className="video-card__thumbnail">
        <img src={thumbnailUrl} alt={video.title} />
      </div>

      <div className="video-card__content">
        <div className="video-card__avatar">
          <Avatar
            src={avatarUrl}
            alt={video.channel.owner.name || video.channel.handle}
            size="md"
          />
        </div>

        <div className="video-card__info">
          <h3 className="video-card__title">{video.title}</h3>
          <span className="video-card__channel">
            {video.channel.owner.name || video.channel.handle}
          </span>
          <div className="video-card__meta">
            <span>{formatViews(video.views)} views</span>
            <span> • </span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
