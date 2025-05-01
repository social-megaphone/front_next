import { axiosInstance } from './axiosInstance'
import { InitialAuthRequest, InitialAuthResponse } from '@/types/apiTypes'

export const postInitial = async ({ goalDuration, goal }: InitialAuthRequest): Promise<InitialAuthResponse> => {
  const response = await axiosInstance.post<InitialAuthResponse>('/auth/initial', { goalDuration, goal })
  return response.data
}
export const getMyProfile = async () => {
  const { data } = await axiosInstance.get('/auth/mypage')
  console.log(data)
  return data
}
