'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
      return response.json()
    },
    staleTime: 30 * 1000,
  })

  const videos = data?.videos || []

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube!</h1>
        </div>
        <div className="message message--loading">Loading videos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube!</h1>
        </div>
        <div className="message message--error">
          ❌ Error: {error instanceof Error ? error.message : 'Something went wrong'}
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
        {videos && videos.length > 0 ? (
          videos.map((video: any) => {
            console.log(video)
            return (
              <Link href={`/watch?v=${video.publicId}`} className="video-card" key={video.id}>
                <div className="video-card__thumbnail">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${video.thumbnailPath}`}
                    alt={video.title}
                  />
                  {/* <span className="video-card__duration">{video.maxQuality}</span> */}
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
            )
          })
        ) : (
          <div className="message message--empty">No videos found</div>
        )}
      </div>
    </div>
  )
}
