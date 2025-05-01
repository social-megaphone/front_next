import { RoutineLog } from '@prisma/client'
import { axiosInstance } from './axiosInstance'
import { RoutineLogType } from '@/stores/useRoutineLogStore'

export const getRoutineLog = async (tag: string): Promise<{ routineLogs: RoutineLogType[] }> => {
  const response = await axiosInstance.get(`/routine-log?tag=${tag}`)
  return response.data
}

export const createRoutineLog = async (routineLog: RoutineLog) => {
  const response = await axiosInstance.post('/routine-log', routineLog)
  return response.data
}

export const getRoutineLogDetail = async (id: string) => {
  const response = await axiosInstance.get(`/routine-log/detail?id=${id}`)
  return response.data
}
