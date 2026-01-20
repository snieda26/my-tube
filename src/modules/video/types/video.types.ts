export interface Video {
  id: string
  publicId: string
  title: string
  description: string
  thumbnailPath: string
  videoFileName: string
  maxQuality: VideoQuality
  availableQualities?: VideoQuality[]
  views: number
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  channel: VideoChannel
  _count: {
    likes: number
    comments: number
  }
}

export interface VideoWithDetails extends Video {
  isLiked: boolean
  likesCount: number
  commentsCount: number
  subscribersCount: number
}

export interface VideoChannel {
  id: string
  handle: string
  bio?: string
  avatarPath?: string
  bannerPath?: string
  isSubscribed?: boolean
  owner: {
    id: string
    name?: string
  }
  _count?: {
    followers: number
  }
}

export type VideoQuality = '360p' | '480p' | '720p' | '1080p'

export interface VideoQueryParams {
  page?: number
  limit?: number
  search?: string
  excludeIds?: string[]
}
