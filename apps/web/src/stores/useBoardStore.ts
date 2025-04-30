import { create } from 'zustand'

export type Post = {
  id: string
  nickname: string
  title: string
  desc: string
  thumbnail: string
  tag: string
  createdAt: string
  liked?: boolean
  bookmarked?: boolean
}

interface BoardStore {
  posts: Post[]
  setPosts: (posts: Post[]) => void
  updatePostStatus: (id: string, status: { liked?: boolean; bookmarked?: boolean }) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  posts: [],
  setPosts: (posts: Post[]) => set({ posts }),
  updatePostStatus: (id: string, status: { liked?: boolean; bookmarked?: boolean }) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === id ? { ...post, ...status } : post)),
    })),
}))
