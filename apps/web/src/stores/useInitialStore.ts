import { create } from 'zustand'

interface InitialStore {
  nickname: string
  setNickname: (nickname: string) => void
}

export const useInitialStore = create<InitialStore>((set) => ({
  nickname: '따뜻한 소라개',
  setNickname: (nickname) => set({ nickname }),
  goal: '',
}))
