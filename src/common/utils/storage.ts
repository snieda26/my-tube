const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'
const BASE_URL = API_URL.replace('/api', '')

/**
 * Constructs a full URL from a storage path
 */
export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BASE_URL}/${cleanPath}`
}

/**
 * Get avatar image URL
 */
export function getAvatarUrl(path: string | null | undefined): string {
  return getStorageUrl(path)
}

/**
 * Get thumbnail image URL
 */
export function getThumbnailUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path

  // Ensure path includes storage prefix
  const needsStoragePrefix = !path.startsWith('storage/') && !path.startsWith('/storage')
  const normalizedPath = needsStoragePrefix ? `storage/${path}` : path

  return getStorageUrl(normalizedPath)
}

/**
 * Get video URL with optional quality
 */
export function getVideoUrl(path: string | null | undefined, quality?: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path

  // Extract filename from path
  const fileName = path.includes('/') ? path.split('/').pop() || path : path

  // Build video path
  const videoPath = quality
    ? `storage/content/videos/${quality}/${fileName}`
    : `storage/content/videos/${fileName}`

  return `${BASE_URL}/${videoPath}`
}
