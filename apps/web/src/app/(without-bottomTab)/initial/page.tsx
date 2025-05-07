'use client'

import UnoptimizedImage from '@/components/ image/UnoptimizedImage'
import Button_Haru from '@/components/ui/Haru/Button'
import Card_Haru from '@/components/ui/Haru/Card'
import { HEAD, NAME } from '@/constants'
import { useInitialStore } from '@/stores/useInitialStore'
import { Button } from '@workspace/ui/components/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function InitialPage() {
  // const { init, isPending } = useInit()
  // useEffect(() => {
  //   init({
  //     goalDuration: 30,
  //     goal: '취업',
  //   })
  // }, [])
  const nickname = useInitialStore((s) => s.initialInfo.nickname)
  const setNickname = useInitialStore((s) => s.setNickname)
  useEffect(() => {
    handleRandomNickname()
  }, [])
  const handleRandomNickname = () => {
    const randomNickname = `${HEAD[Math.floor(Math.random() * HEAD.length)]} ${NAME[Math.floor(Math.random() * NAME.length)]} `
    setNickname(randomNickname)
  }
  const router = useRouter()
  const handleNext = () => {
    router.push('/initial/goal')
  }
  return (
    <>
      {/* {isPending ? <h1 className="mt-12">임시 유저, 토큰 생성중입니다.</h1> : <h1>완료</h1>} */}
      <div className="flex-1 w-full flex flex-col items-center justify-center -space-y-8">
        <UnoptimizedImage src="/haru.png" alt="initial" width={180} height={180} className="z-10" />
        <Card_Haru
          text={
            <p className="font-bold">
              똑똑, 하루잇 방에
              <br />
              찾아온 <span className="text-blue-500">{nickname}</span> 님,
              <br />
              만나서 반가워요!
            </p>
          }
        />
        <div className="w-80 aspect-square relative mt-8">
          <UnoptimizedImage src="/haru_note.png" alt="haru_note" fill className="object-contain" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <UnoptimizedImage src="/haru_user.png" alt="haru_user" width={80} height={80} />
            <p className="text-xl text-haru-brown font-medium py-1">{nickname}</p>
            <Button variant="outline" onClick={handleRandomNickname}>
              랜덤 닉네임 생성
            </Button>
          </div>
        </div>
      </div>
      <Button_Haru onClick={handleNext}>다음</Button_Haru>
    </>
  )
}
