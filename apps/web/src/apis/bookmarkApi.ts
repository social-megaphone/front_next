import { axiosInstance } from './axiosInstance'

export const toggleBookmark = async (routineLogId: string) => {
  const response = await axiosInstance.post('/bookmark', { routineLogId })
  return response.data
}

export const getBookmarks = async () => {
  const response = await axiosInstance.get('/bookmark')
  return response.data
}
