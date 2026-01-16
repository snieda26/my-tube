'use client'

import { HiOutlineHeart } from 'react-icons/hi'
import Avatar from '@/common/components/ui/avatar/Avatar'
import Button from '@/common/components/ui/button/Button'

export default function WatchPage() {
  return (
    <div className="watch-page">
      <div className="watch-page__main">
        {/* Video Player Placeholder */}
        <div className="video-player">
          <div className="video-player__placeholder">Video Player (Coming Soon)</div>
        </div>

        {/* Video Info */}
        <div className="video-info">
          <h1 className="video-info__title">Video Title</h1>

          <div className="video-info__meta">
            <div className="video-info__stats">
              <span>12,453 views</span>
              <span>2 days ago</span>
            </div>

            <div className="video-info__actions">
              <button className="video-info__action">
                <HiOutlineHeart />
                <span>342</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Info */}
        <div className="channel-info">
          <div className="channel-info__left">
            <Avatar src={null} alt="Channel" size="lg" />
            <div className="channel-info__details">
              <a href="/channel/@channel" className="channel-info__name">
                Channel Name
              </a>
              <span className="channel-info__subscribers">125K subscribers</span>
            </div>
          </div>

          <Button variant="primary">Subscribe</Button>
        </div>

        {/* Description */}
        <div className="video-description">
          <div className="video-description__content">
            Video description will appear here...
          </div>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <div className="comments-section__header">
            <h3>Comments</h3>
            <span>0</span>
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
            {/* Comments will be loaded here */}
          </div>
        </div>
      </div>

      <div className="watch-page__sidebar">
        <div className="similar-videos">
          <h3 className="similar-videos__header">Similar Videos</h3>
          <div className="similar-videos__list">
            {/* Videos will be loaded here */}
          </div>
        </div>
      </div>
    </div>
  )
}
