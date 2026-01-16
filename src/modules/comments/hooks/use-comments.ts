import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentService } from '../services/comment.service'
import { CreateCommentDto } from '../types/comment.types'
import toast from 'react-hot-toast'

export function useComments(videoId: string) {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => commentService.getVideoComments(videoId),
    enabled: !!videoId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentService.createComment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.videoId] })
      queryClient.invalidateQueries({ queryKey: ['video'] })
      toast.success('Comment added')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['video'] })
      toast.success('Comment deleted')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment')
    },
  })
}
