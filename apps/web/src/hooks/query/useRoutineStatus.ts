import { toggleLike } from '@/apis'
import { useBookmarkStore } from '@/stores/useBookmarkStore'
import { useRoutineLogStore } from '@/stores/useRoutineLogStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useToggleLike = () => {
  const queryClient = useQueryClient()
  const { routineLogs, setRoutineLogs } = useRoutineLogStore()
  const { bookmarks, setBookmarks } = useBookmarkStore()

  return useMutation({
    mutationFn: toggleLike,
    onMutate(variables) {
      setRoutineLogs(
        routineLogs.map((routineLog) =>
          routineLog.id === variables ? { ...routineLog, liked: !routineLog.liked } : routineLog,
        ),
      )
      setBookmarks(
        bookmarks.map((bookmark) => (bookmark.id === variables ? { ...bookmark, liked: !bookmark.liked } : bookmark)),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routineLog-status'] })
      queryClient.invalidateQueries({ queryKey: ['routineLogs'] })
    },
  })
}

// export const useRoutineStatus = (routineLogId: string) => {
//   const setRoutineStatus = useRoutineStatusStore((state) => state.setRoutineStatus)

//   const { data, isLoading } = useQuery({
//     queryKey: ['routineLog-status', routineLogId],
//     queryFn: () => getRoutineStatus(routineLogId),
//     enabled: !!routineLogId,
//     staleTime: 5 * 60 * 1000,
//   })

//   useEffect(() => {
//     if (data) {
//       setRoutineStatus({
//         isLiked: data.isLiked,
//         isBookmarked: data.isBookmarked,
//         likeCount: data.likeCount,
//       })
//     }
//   }, [data, setRoutineStatus])

//   return { isPending: isLoading }
// }
