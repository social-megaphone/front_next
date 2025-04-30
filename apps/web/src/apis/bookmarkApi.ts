import { axiosInstance } from './axiosInstance'

export const toggleBookmark = async (routineId: string) => {
  const response = await axiosInstance.post('/bookmark', { routineId })
  return response.data
}

export const getBookmarks = async () => {
  const response = await axiosInstance.get('/bookmark')
  return response.data
}
