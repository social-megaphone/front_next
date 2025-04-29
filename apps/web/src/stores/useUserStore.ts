import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type User = {
  nickName: string
  profileImage: string
}

interface UserStore {
  user: User | null
  setUser: (user: User) => void
}
const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
    }),
    { name: 'user', storage: createJSONStorage(() => sessionStorage) },
  ),
)

export default useUserStore
