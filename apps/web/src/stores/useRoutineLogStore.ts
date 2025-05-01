import { create } from 'zustand'

export type RoutineLogType = {
  id: string
  title: string
  desc: string
  logImg: string
  tag: string
  performedAt: string
  reflection: string
  nickname: string
  liked: boolean
  bookmarked: boolean
}

interface RoutineLogStore {
  routineLogs: RoutineLogType[]
  setRoutineLogs: (routineLogs: RoutineLogType[]) => void
  updateRoutineLogStatus: (id: string, status: { liked?: boolean; bookmarked?: boolean }) => void
}

export const useRoutineLogStore = create<RoutineLogStore>((set) => ({
  routineLogs: [],
  setRoutineLogs: (routineLogs: RoutineLogType[]) => set({ routineLogs }),
  updateRoutineLogStatus: (id: string, status: { liked?: boolean; bookmarked?: boolean }) =>
    set((state) => ({
      routineLogs: state.routineLogs.map((routineLog) =>
        routineLog.id === id ? { ...routineLog, ...status } : routineLog,
      ),
    })),
}))
