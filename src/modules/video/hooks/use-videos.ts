import { useQuery } from '@tanstack/react-query'
import { videoService } from '../services/video.service'

export function useExploreVideos(excludeIds?: string[]) {
  return useQuery({
    queryKey: ['videos', 'explore', excludeIds],
    queryFn: () => videoService.getVideos({ page: 1, limit: 10, excludeIds }),
  })
}
