import { apiClient } from '@/infrastructure/api/client'
import { Comment, CreateCommentDto, CommentsResponse } from '../types/comment.types'

export const commentService = {
  // Get comments for video
  async getVideoComments(videoId: string, page = 1, limit = 20): Promise<CommentsResponse> {
    const response = await apiClient.get(`/api/comments/video/${videoId}`, {
      params: { page, limit },
    })
    return response.data
  },

  // Create comment
  async createComment(data: CreateCommentDto): Promise<Comment> {
    const response = await apiClient.post('/api/comments', data)
    return response.data
  },

  // Delete comment
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/api/comments/${commentId}`)
  },
}
