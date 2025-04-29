interface InitialAuthRequest {
  goalDuration: number
  goal: string
}

interface InitialAuthResponse {
  nickname: string
  profileImage: string
}

export type { InitialAuthRequest, InitialAuthResponse }
