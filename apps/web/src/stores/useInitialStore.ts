import { create } from 'zustand'
import { RoutineType } from '@/types/initType'
interface InitialInfo {
  nickname: string
  goal: RoutineType | null
  tags: string[]
  goalDate: number
  imgSrc: string | null
  reflection: string
}

interface InitialStore {
  initialInfo: InitialInfo
  setNickname: (nickname: string) => void
  setGoal: (goal: RoutineType) => void
  setTags: (tags: string[]) => void
  setGoalDate: (goalDate: number) => void
  setImgSrc: (imgSrc: string) => void
  setReflection: (reflection: string) => void
}

export const useInitialStore = create<InitialStore>()((set) => ({
  initialInfo: {
    nickname: '',
    goal: null,
    goalDate: 7,
    tags: [],
    imgSrc: null,
    reflection: '',
  },
  setNickname: (nickname) =>
    set((state) => ({
      initialInfo: { ...state.initialInfo, nickname },
    })),
  setGoal: (goal) =>
    set((state) => ({
      initialInfo: { ...state.initialInfo, goal },
    })),
  setGoalDate: (goalDate) =>
    set((state) => ({
      initialInfo: { ...state.initialInfo, goalDate },
    })),
  setTags: (tags) =>
    set((state) => ({
      initialInfo: { ...state.initialInfo, tags },
    })),
  setImgSrc: (imgSrc) =>
    set((state) => ({
      initialInfo: { ...state.initialInfo, imgSrc },
    })),
  setReflection: (reflection) =>
    set((state) => ({
      initialInfo: { ...state.initialInfo, reflection },
    })),
}))
