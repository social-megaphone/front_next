'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    router.push('/home')
  }, [])
  return <div className="flex items-center justify-center h-full flex-1"></div>
}
