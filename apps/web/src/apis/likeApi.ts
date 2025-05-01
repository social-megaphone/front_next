import { axiosInstance } from './axiosInstance'

export const toggleLike = async (routineLogId: string) => {
  const response = await axiosInstance.post('/like', { routineLogId })
  return response.data
}

export const getRoutineStatus = async (routineLogId: string) => {
  const response = await axiosInstance.get(`/routine-status?routineLogId=${routineLogId}`)
  return response.data
}
