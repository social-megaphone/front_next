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

  return <div>InitialPage</div>
}
