'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

// 🎯 Простий приклад React Query для курсу

// ❌ СТАРИЙ СПОСІБ (для порівняння):
// export default function HomePage() {
//   const [videos, setVideos] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//
//   useEffect(() => {
//     setIsLoading(true)
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
//       .then((res) => res.json())
//       .then((data) => {
//         setVideos(data.videos)
//         setIsLoading(false)
//       })
//       .catch(() => setIsLoading(false))
//   }, [])
//
//   if (isLoading) return <div>Loading...</div>
//   return <div>Videos: {videos.length}</div>
// }

// ✅ НОВИЙ СПОСІБ з React Query:
export default function HomePage() {
  // 🎯 useQuery - хук для завантаження даних
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos'], // 1️⃣ Унікальний ключ для кешування
    queryFn: async () => {
      // 2️⃣ Функція для завантаження даних
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
      if (!response.ok) throw new Error('Failed to fetch videos')
      return response.json()
    },
    staleTime: 60 * 1000, // 3️⃣ Кешувати на 1 хвилину
  })

  const videos = data?.videos || []

  // Стан завантаження
  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube!</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
          🔄 Loading videos...
        </div>
      </div>
    )
  }

  // Стан помилки
  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube!</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#f44336' }}>
          ❌ Error: {error instanceof Error ? error.message : 'Something went wrong'}
        </div>
      </div>
    )
  }

  // Відображення даних
  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Welcome to MyTube!</h1>
        <p style={{ color: '#888', marginTop: '0.5rem' }}>
          💡 Дані кешуються на 1 хвилину. Відкрийте DevTools → Network, щоб побачити!
        </p>
      </div>

      <div className="video-grid">
        {videos && videos.length > 0 ? (
          videos.map((video: any) => (
            <Link href={`/watch?v=${video.publicId}`} className="video-card" key={video.id}>
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
