import { getRoutineStatus, toggleLike } from '@/apis'
import { useBoardStore } from '@/stores/useBoardStore'
import { useRoutineStatusStore } from '@/stores/useRoutineStatusStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useToggleLike = () => {
  const queryClient = useQueryClient()
  const { posts, setPosts } = useBoardStore()
  return useMutation({
    mutationFn: toggleLike,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routine-status'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      setPosts(posts.map((post) => (post.id === variables ? { ...post, liked: !post.liked } : post)))
    },
  })
}

export const useRoutineStatus = (routineId: string) => {
  const setRoutineStatus = useRoutineStatusStore((state) => state.setRoutineStatus)

  const { data, isLoading } = useQuery({
    queryKey: ['routine-status', routineId],
    queryFn: () => getRoutineStatus(routineId),
    enabled: !!routineId,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (data) {
      setRoutineStatus({
        isLiked: data.isLiked,
        isBookmarked: data.isBookmarked,
        likeCount: data.likeCount,
      })
    }
  }, [data, setRoutineStatus])

  return { isPending: isLoading }
}
