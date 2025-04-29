'use client'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/icons/Icon'

function TopGoBackBar() {
  const router = useRouter()

  return (
    <div className="flex items-center bg-haru-brown justify-between w-full h-16">
      <div onClick={() => router.back()} className="flex items-center px-4">
        <Icon name="arrowLeft" className="text-white" />
      </div>
    </div>
  )
}

export default TopGoBackBar
