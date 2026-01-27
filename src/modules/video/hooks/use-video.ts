import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoService } from '../services/video.service'
import toast from 'react-hot-toast'

export function useVideo(publicId: string) {
  return useQuery({
    queryKey: ['video', publicId],
    queryFn: () => videoService.getVideo(publicId),
    enabled: !!publicId,
    retry: 1,
    throwOnError: false,
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (videoId: string) => videoService.toggleLike(videoId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['video'] })

      const previousData = queryClient.getQueryData(['video'])

      queryClient.setQueriesData({ queryKey: ['video'] }, (old: unknown) => {
        if (old && typeof old === 'object' && 'isLiked' in old) {
          const video = old as { isLiked: boolean; likesCount: number }
          return {
            ...video,
            isLiked: !video.isLiked,
            likesCount: video.isLiked ? video.likesCount - 1 : video.likesCount + 1,
          }
        }
        return old
      })

      return { previousData }
    },
    onError: (_err, _videoId, context) => {
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
