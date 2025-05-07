import { RoutineType } from './initType'

interface InitialAuthRequest {
  nickname: string
  goalDate: number
  goal: RoutineType // 목표
  reflection: string // 소감
  imgSrc: string
}

interface InitialAuthResponse {
  nickname: string
  profileImage: string
}

export type { InitialAuthRequest, InitialAuthResponse }
