import { axiosInstance } from './axiosInstance'

export const getBoards = async (tags: string[]) => {
  const response = await axiosInstance.post(`/board/getboards`, { tags })
  console.log(response.data)
  return response.data
}
