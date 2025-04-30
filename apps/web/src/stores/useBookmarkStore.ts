import { create } from 'zustand'

export type BookmarkedPost = {
  id: string
  nickname: string
  title: string
  desc: string
  thumbnail: string
  tag: string
  createdAt: string
  bookmarkId: string
}

interface BookmarkStore {
  bookmarks: BookmarkedPost[]
  setBookmarks: (bookmarks: BookmarkedPost[]) => void
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  setBookmarks: (bookmarks: BookmarkedPost[]) => set({ bookmarks }),
}))
