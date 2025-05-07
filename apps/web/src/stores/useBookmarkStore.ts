import { BookmarkedPost } from '@/types/bookmarkType'
import { create } from 'zustand'

interface BookmarkStore {
  bookmarks: BookmarkedPost[]
  setBookmarks: (bookmarks: BookmarkedPost[]) => void
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  setBookmarks: (bookmarks: BookmarkedPost[]) => set({ bookmarks }),
}))
