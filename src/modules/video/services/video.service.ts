import { apiClient } from '@/infrastructure/api/client'
import { VideoWithDetails, VideoQueryParams } from '../types/video.types'

export const videoService = {
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

  async getVideo(publicId: string): Promise<VideoWithDetails> {
    const response = await apiClient.get(`/api/videos/${publicId}`)
    return response.data
  },

  async recordView(videoId: string): Promise<void> {
    await apiClient.post(`/api/views/video/${videoId}`)
  },

  async toggleLike(videoId: string) {
    const response = await apiClient.post(`/api/likes/video/${videoId}`)
    return response.data
  },
}
