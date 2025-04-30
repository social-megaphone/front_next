import { getBoards } from '@/apis/boardApi'
import { useBoardStore } from '@/stores/useBoardStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useBoard = ({ tag }: { tag: string }) => {
  const setPosts = useBoardStore((state) => state.setPosts)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['boards', tag],
    queryFn: () => getBoards(tag),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!tag,
  })

  useEffect(() => {
    if (data) {
      const posts = data.routines.map((post: any) => ({
        id: post.id,
        nickname: post.nickname,
        title: post.title,
        desc: post.desc,
        thumbnail: post.thumbnailImg,
        tag: post.tag,
        createdAt: post.createdAt,
        liked: post.liked,
        bookmarked: post.bookmarked,
      }))
      setPosts(posts)
    }
  }, [data, setPosts])

  return { isPending: isLoading, refetch }
}
