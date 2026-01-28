/**
 * Format large numbers with K/M suffix
 * @example formatCompactNumber(1500) => "1.5K"
 * @example formatCompactNumber(1500000) => "1.5M"
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}

/**
 * Format a date string as relative time ago
 * @example formatTimeAgo("2024-01-01T00:00:00Z") => "2 days ago"
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals = [
    { seconds: 31536000, label: 'year' },
    { seconds: 2592000, label: 'month' },
    { seconds: 86400, label: 'day' },
    { seconds: 3600, label: 'hour' },
    { seconds: 60, label: 'minute' },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

/**
 * Format seconds to time string (HH:MM:SS or MM:SS)
 * @example formatDuration(125) => "2:05"
 * @example formatDuration(3725) => "1:02:05"
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00'

  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
