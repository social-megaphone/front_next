import { getBookmarks, toggleBookmark } from '@/apis'
import { useBoardStore } from '@/stores/useBoardStore'
import { useBookmarkStore } from '@/stores/useBookmarkStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useToggleBookmark = () => {
  const queryClient = useQueryClient()
  const { posts, setPosts } = useBoardStore()
  return useMutation({
    mutationFn: toggleBookmark,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      queryClient.invalidateQueries({ queryKey: ['routine-status'] })
      setPosts(posts.map((post) => (post.id === variables ? { ...post, bookmarked: !post.bookmarked } : post)))
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
