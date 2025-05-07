import { axiosInstance } from './axiosInstance'
import { InitialAuthRequest, InitialAuthResponse } from '@/types/apiTypes'

export const postInitial = async ({
  nickname,
  goalDate,
  goal,
  reflection,
  imgSrc,
}: InitialAuthRequest): Promise<InitialAuthResponse> => {
  const response = await axiosInstance.post<InitialAuthResponse>('/auth/initial', {
    nickname,
    goalDate,
    routine: goal,
    reflection,
    imgSrc,
  })
  return response.data
}
export const getMyProfile = async () => {
  const { data } = await axiosInstance.get('/auth/mypage')
  console.log(data)
  return data
}
