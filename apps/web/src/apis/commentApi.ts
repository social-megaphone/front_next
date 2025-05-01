import { axiosInstance } from './axiosInstance'

export interface Comment {
  id: string
  content: string
  createdAt: string
  userId: string
  nickname: string
}

export interface CommentRequest {
  routineLogId: string
  content: string
}

export const addComment = async (comment: CommentRequest): Promise<Comment> => {
  const response = await axiosInstance.post('/comment', comment)
  return response.data
}

export const getComments = async (routineLogId: string): Promise<Comment[]> => {
  const response = await axiosInstance.get(`/comment?routineLogId=${routineLogId}`)
  return response.data.comments
}
