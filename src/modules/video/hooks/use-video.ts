import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoService } from '../services/video.service'
import toast from 'react-hot-toast'

export function useVideo(publicId: string) {
  return useQuery({
    queryKey: ['video', publicId],
    queryFn: () => videoService.getVideo(publicId),
    enabled: !!publicId,
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (videoId: string) => videoService.toggleLike(videoId),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['video'] })

      const previousData = queryClient.getQueryData(['video'])

      queryClient.setQueriesData({ queryKey: ['video'] }, (old: any) => {
        if (old) {
          return {
            ...old,
            isLiked: !old.isLiked,
            likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
          }
        }
        return old
      })

      return { previousData }
    },
    onError: (_err, _videoId, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(['video'], context.previousData)
      }
      toast.error('Failed to update like')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['video'] })
    },
  })
}

export function useRecordView() {
  return useMutation({
    mutationFn: (videoId: string) => videoService.recordView(videoId),
  })
}
