'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
export default function InitialLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div
      className="flex flex-col items-center justify-between h-screen px-10 pb-4 overflow-hidden"
      style={{ backgroundImage: 'url(/haru_flower_pattern.png)' }}
    >
      <div className="absolute left-4 top-4 rounded-full p-3 bg-white flex items-center justify-center">
        <ChevronLeftIcon className="w-8 h-8 text-gray-500" onClick={() => router.back()} />
      </div>
      {children}
    </div>
  )
}
