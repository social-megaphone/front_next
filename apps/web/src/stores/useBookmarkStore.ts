import { create } from 'zustand'

export type BookmarkedPost = {
  id: string
  nickname: string
  title: string
  desc: string
  logImg: string
  tag: string
  performedAt: string
  bookmarkId: string
  isBookmarked: boolean
  reflection: string
  liked: boolean
}

interface BookmarkStore {
  bookmarks: BookmarkedPost[]
  setBookmarks: (bookmarks: BookmarkedPost[]) => void
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  setBookmarks: (bookmarks: BookmarkedPost[]) => set({ bookmarks }),
}))
