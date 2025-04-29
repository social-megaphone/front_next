import { create } from 'zustand'

export type Post = {
  id: string
  nickname: string
  title: string
  desc: string
  // didILike: boolean
  thumbnail: string
  tag: string
  createdAt: string
}

interface BoardStore {
  posts: Post[]
  setPosts: (posts: Post[]) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  posts: [],
  setPosts: (posts: Post[]) => set({ posts }),
}))
