const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'
const BASE_URL = API_URL.replace('/api', '')

export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return ''

  if (path.startsWith('http')) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  return `${BASE_URL}/${cleanPath}`
}

export function getAvatarUrl(path: string | null | undefined): string {
  return getStorageUrl(path)
}

export function getThumbnailUrl(path: string | null | undefined): string {
  if (!path) return ''

  if (!path.startsWith('http') && !path.startsWith('storage/') && !path.startsWith('/storage')) {
    return `${BASE_URL}/storage/${path}`
  }

  return getStorageUrl(path)
}

export function getVideoUrl(path: string | null | undefined, quality?: string): string {
  if (!path) return ''

  if (path.startsWith('http')) {
    return path
  }

  if (quality) {
    const fileName = path.split('/').pop() || path
    return `${BASE_URL}/storage/content/videos/${quality}/${fileName}`
  }

  if (!path.includes('/') && !path.startsWith('storage')) {
    return `${BASE_URL}/storage/content/videos/${path}`
  }

  if (!path.startsWith('storage/') && !path.startsWith('/storage')) {
    return `${BASE_URL}/storage/${path}`
  }

  return getStorageUrl(path)
}
