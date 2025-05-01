'use client'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/icons/Icon'

function TopGoBackBar({ title, subTitle }: { title?: string; subTitle?: string }) {
  const router = useRouter()

  return (
    <div className="flex items-center shrink-0 justify-between w-full h-16 relative  border-haru-brown border-b">
      <div onClick={() => router.back()} className="flex items-center pl-4">
        <Icon name="chevronLeft" className="w-8 h-8" />
      </div>
      <div className="absolute pt-1 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
        <p className="text-[#666666] leading-none text-lg font-medium">{title || '하루잇 Haru-It'}</p>
        <p className="text-black text-xl font-bold">{subTitle || '게시물'}</p>
      </div>
    </div>
  )
}

export default TopGoBackBar
