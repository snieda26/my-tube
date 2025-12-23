'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos?page=1&limit=20`)
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data)
        console.log('First video thumbnail:', data.videos?.[0]?.thumbnailPath || data.data?.[0]?.thumbnailPath)
        // Backend returns either 'videos' or 'data' depending on version
        setVideos(data.data || data.videos || [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching videos:', err)
        setVideos([])
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube!</h1>
        </div>
        <div className="video-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="video-card" key={i}>
              <div className="video-card__thumbnail">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #252542 0%, #1a1a2e 100%)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Welcome to MyTube!</h1>
      </div>

      <div className="video-grid">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {videos && videos.length > 0 ? videos.map((video: any) => (
          <div className="video-card" key={video.id}>
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
              <span className="video-card__duration">{video.maxQuality}</span>
            </div>
            <div className="video-card__content">
              <img
                src={video.channel.avatarPath ? `${process.env.NEXT_PUBLIC_API_URL}${video.channel.avatarPath}` : `https://i.pravatar.cc/36?u=${video.channel.id}`}
                alt={video.channel.handle}
                className="video-card__avatar"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
              />
              <div className="video-card__info">
                <h3 className="video-card__title">{video.title}</h3>
                <div className="video-card__channel">@{video.channel.handle}</div>
                <p className="video-card__meta">
                  <span>{video.views} views</span>
                  <span>{new Date(video.publishedAt || video.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No videos found
          </div>
        )}
      </div>
    </div>
  )
}

