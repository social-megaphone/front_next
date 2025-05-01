import { getBookmarks, toggleBookmark } from '@/apis'
import { useBookmarkStore } from '@/stores/useBookmarkStore'
import { useRoutineLogStore } from '@/stores/useRoutineLogStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useToggleBookmark = () => {
  const queryClient = useQueryClient()
  const { routineLogs, setRoutineLogs } = useRoutineLogStore()
  return useMutation({
    mutationFn: toggleBookmark,
    onMutate(variables) {
      setRoutineLogs(
        routineLogs.map((routineLog) =>
          routineLog.id === variables ? { ...routineLog, bookmarked: !routineLog.bookmarked } : routineLog,
        ),
      )
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['routine-status'] })
      queryClient.invalidateQueries({ queryKey: ['routineLogs'] })
    },
  })
}

export const useBookmarks = () => {
  const setBookmarks = useBookmarkStore((state) => state.setBookmarks)

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    if (data?.bookmarks) {
      setBookmarks(data.bookmarks)
    }
  }, [data, setBookmarks])

  return { isPending: isLoading }
}
