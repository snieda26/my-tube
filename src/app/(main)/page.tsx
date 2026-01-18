'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
      .then((res) => res.json())
      .then((data) => setVideos(data.videos))
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Welcome to MyTube!</h1>
      </div>

      <div className="video-grid">
        {videos && videos.length > 0 ? (
          videos.map((video: any) => (
            <Link href={`/watch?v=${video.publicId}`} key={video.id} className="video-card">
              <div className="video-card__thumbnail">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${video.thumbnailPath}`}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className="video-card__content">
                <img
                  src={
                    video.channel.avatarPath
                      ? `${process.env.NEXT_PUBLIC_API_URL}${video.channel.avatarPath}`
                      : `https://i.pravatar.cc/36?u=${video.channel.id}`
                  }
                  alt={video.channel.handle}
                  className="video-card__avatar"
                  style={{ width: 36, height: 36, borderRadius: '50%' }}
                />
                <div className="video-card__info">
                  <h3 className="video-card__title">{video.title}</h3>
                  <div className="video-card__channel">@{video.channel.handle}</div>
                  <p className="video-card__meta">
                    <span>{video.views} views</span>
                    <span>
                      {new Date(video.publishedAt || video.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No videos found</div>
        )}
      </div>
    </div>
  )
}
