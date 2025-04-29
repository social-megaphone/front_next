import { getBoards } from '@/apis/boardApi'
import { useBoardStore } from '@/stores/useBoardStore'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

const useBoardMutation = () => {
  const setPosts = useBoardStore((state) => state.setPosts)

  return useMutation({
    mutationFn: ({ tags }: { tags: string[] }) => getBoards(tags),
    onSuccess: (data) => {
      const posts = data.routines.map((post: any) => ({
        id: post.id,
        nickname: post.user.nickname,
        title: post.title,
        desc: post.desc,
        thumbnail: post.thumbnailImg,
        tag: post.tag,
        createdAt: post.createdAt,
      }))
      setPosts(posts)
    },
  })
}

export const useBoard = ({ tags }: { tags: string[] }) => {
  const { mutate: getBoards, isPending } = useBoardMutation()

  useEffect(() => {
    getBoards({ tags })
  }, [])

  return { getBoards, isPending }
}
