import { apiClient } from '@/infrastructure/api/client'
import { VideoWithDetails, VideoQueryParams } from '../types/video.types'

export const videoService = {
  // Get videos (discover/explore)
  async getVideos(params: VideoQueryParams = {}) {
    const { page = 1, limit = 20, search, excludeIds } = params
    const response = await apiClient.get('/api/videos', {
      params: {
        page,
        limit,
        search,
        excludeIds: excludeIds?.join(','),
      },
    })
    return response.data
  },

  // Get video by public ID
  async getVideo(publicId: string): Promise<VideoWithDetails> {
    const response = await apiClient.get(`/api/videos/${publicId}`)
    return response.data
  },

  // Toggle like
  async toggleLike(videoId: string) {
    const response = await apiClient.post(`/api/likes/video/${videoId}`)
    return response.data
  },

  // Record view (for watch history)
  async recordView(videoId: string): Promise<void> {
    await apiClient.post(`/api/views/video/${videoId}`)
  },
}
