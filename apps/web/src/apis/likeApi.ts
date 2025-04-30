import { axiosInstance } from './axiosInstance'

export const toggleLike = async (routineId: string) => {
  const response = await axiosInstance.post('/like', { routineId })
  return response.data
}

export const getRoutineStatus = async (routineId: string) => {
  const response = await axiosInstance.get(`/routine-status?routineId=${routineId}`)
  return response.data
}
