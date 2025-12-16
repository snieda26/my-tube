export interface Channel {
  id: string
  handle: string
  bio: string | null
  avatarPath: string | null
  bannerPath: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name: string | null
    email: string
  }
  videosCount: number
  followersCount: number
  isSubscribed?: boolean
  _count?: {
    videos: number
    followers: number
  }
}
