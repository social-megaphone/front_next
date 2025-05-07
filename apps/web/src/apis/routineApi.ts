import { axiosInstance } from './axiosInstance'

export const getRoutine = async (tag: string) => {
  const response = await axiosInstance.get(`/routine?tag=${tag}`)
  return response.data
}
