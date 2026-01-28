import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoService } from '../services/video.service'
import { VideoWithDetails } from '../types/video.types'
import toast from 'react-hot-toast'

const VIDEO_QUERY_KEY = 'video' as const

export function useVideo(publicId: string) {
  return useQuery({
    queryKey: [VIDEO_QUERY_KEY, publicId],
    queryFn: () => videoService.getVideo(publicId),
    enabled: !!publicId,
    retry: 1,
    throwOnError: false,
  })
}

export function useToggleLike(publicId: string) {
  const queryClient = useQueryClient()
  const queryKey = [VIDEO_QUERY_KEY, publicId]

  return useMutation({
    mutationFn: (videoId: string) => videoService.toggleLike(videoId),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<VideoWithDetails>(queryKey)

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<VideoWithDetails>(queryKey, {
          ...previousData,
          isLiked: !previousData.isLiked,
          likesCount: previousData.isLiked
            ? previousData.likesCount - 1
            : previousData.likesCount + 1,
        })
      }

      return { previousData }
    },
    onError: (_err, _videoId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      toast.error('Failed to update like')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export function useRecordView() {
  return useMutation({
    mutationFn: (videoId: string) => videoService.recordView(videoId),
  })
}
