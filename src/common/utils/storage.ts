import { API_CONFIG } from '@/modules/auth/config/api.config'

/**
 * Get base URL without /api suffix
 */
const getBaseUrl = () => API_CONFIG.baseURL.replace('/api', '')

/**
 * Get full URL for any storage file
 */
export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return ''

  // If already a full URL, return as is
  if (path.startsWith('http')) {
    return path
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  return `${getBaseUrl()}/${cleanPath}`
}

/**
 * Get video thumbnail URL
 */
export function getThumbnailUrl(path: string | null | undefined): string {
  if (!path) return ''

  if (path.startsWith('http')) {
    return path
  }

  // If it's just a relative path, prepend storage
  if (!path.startsWith('storage/') && !path.startsWith('/storage')) {
    return `${getBaseUrl()}/storage/${path}`
  }

  return getStorageUrl(path)
}

/**
 * Get video file URL with quality support
 */
export function getVideoUrl(path: string | null | undefined, quality?: string): string {
  if (!path) return ''

  if (path.startsWith('http')) {
    return path
  }

  const baseUrl = getBaseUrl()

  // If quality is specified and path is just a filename
  if (quality && !path.includes('/')) {
    return `${baseUrl}/storage/content/videos/${quality}/${path}`
  }

  // If it's just a filename without path
  if (!path.includes('/') && !path.startsWith('storage')) {
    return `${baseUrl}/storage/content/videos/${path}`
  }

  // If path doesn't start with storage/, prepend it
  if (!path.startsWith('storage/') && !path.startsWith('/storage')) {
    return `${baseUrl}/storage/${path}`
  }

  return getStorageUrl(path)
}

/**
 * Get avatar URL
 */
export function getAvatarUrl(path: string | null | undefined): string {
  return getStorageUrl(path)
}
