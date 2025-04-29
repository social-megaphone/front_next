'use client'

import { useInit } from '@/hooks/query/useInit'
import { useEffect } from 'react'

export default function InitialPage() {
  const { init, isPending } = useInit()
  useEffect(() => {
    init({
      goalDuration: 30,
      goal: '취업',
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full text-4xl font-bold">
      InitialPage
      {isPending ? <h1 className="mt-12">임시 유저, 토큰 생성중입니다.</h1> : <h1>완료</h1>}
    </div>
  )
}
