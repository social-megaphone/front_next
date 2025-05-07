import { imageAxiosInstance } from './axiosInstance'

export const uploadImage = async (image: File) => {
  const formData = new FormData()
  formData.append('img', image)
  const response = await imageAxiosInstance.post('/img-upload', formData)
  return response.data
}
