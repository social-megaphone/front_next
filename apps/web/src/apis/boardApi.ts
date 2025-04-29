import { axiosInstance } from './axiosInstance'

export const getBoards = async (tag: string) => {
  const response = await axiosInstance.post(`/board/getboards`, { tag })
  console.log(response.data)
  return response.data
}
