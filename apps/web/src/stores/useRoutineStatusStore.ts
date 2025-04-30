import { create } from 'zustand'

interface RoutineStatusStore {
  isLiked: boolean
  isBookmarked: boolean
  likeCount: number
  setIsLiked: (isLiked: boolean) => void
  setIsBookmarked: (isBookmarked: boolean) => void
  setLikeCount: (likeCount: number) => void
  setRoutineStatus: (status: { isLiked: boolean; isBookmarked: boolean; likeCount: number }) => void
}

export const useRoutineStatusStore = create<RoutineStatusStore>((set) => ({
  isLiked: false,
  isBookmarked: false,
  likeCount: 0,
  setIsLiked: (isLiked: boolean) => set({ isLiked }),
  setIsBookmarked: (isBookmarked: boolean) => set({ isBookmarked }),
  setLikeCount: (likeCount: number) => set({ likeCount }),
  setRoutineStatus: (status: { isLiked: boolean; isBookmarked: boolean; likeCount: number }) => set(status),
}))
