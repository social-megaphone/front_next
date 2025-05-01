'use client'
import { useToggleLike } from '@/hooks/query/useRoutineStatus'
import { useToggleBookmark } from '@/hooks/query/useBookmarks'
import { useRoutineStatusStore } from '@/stores/useRoutineStatusStore'
import { Button } from '@workspace/ui/components/button'
import { HeartIcon, BookmarkIcon } from 'lucide-react'
import Image from 'next/image'
import { useRoutineLogDetail } from '@/hooks/query/useRoutineLogs'
import { useRouter } from 'next/navigation'
function RoutineDetailPage({ id }: { id: string }) {
  const { mutate: toggleLike } = useToggleLike()
  const { mutate: toggleBookmark } = useToggleBookmark()

  // const { isPending } = useRoutineStatus(id)
  // const { isLiked, isBookmarked, likeCount } = useRoutineStatusStore()
  const { routineLogDetail, isPending: isLoading } = useRoutineLogDetail({ id })

  const handleLike = () => {
    toggleLike(id)
  }

  const handleBookmark = () => {
    toggleBookmark(id)
  }
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <p>로딩 중...</p>
      </div>
    )
  }
  if (!routineLogDetail) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <p>루틴을 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => router.back()}>
          돌아가기
        </Button>
      </div>
    )
  }
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={routineLogDetail?.logImg || '/noImg.png'}
          alt={routineLogDetail?.title || 'rdimg'}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{routineLogDetail?.title}</h1>
          <span className="px-3 py-1 bg-haru-brown text-white rounded-full text-sm">{routineLogDetail?.tag}</span>
        </div>
        <p className="text-gray-600 text-sm">{routineLogDetail?.nickname}님의 루틴</p>
        <p className="mt-2">{routineLogDetail?.desc}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleLike} className="flex items-center gap-2">
            <HeartIcon className={routineLogDetail.isLiked ? 'fill-red-500 text-red-500' : ''} size={20} />
            <span>{routineLogDetail.likeCount}</span>
          </Button>
        </div>
        <Button variant="ghost" onClick={handleBookmark} className="flex items-center gap-2">
          <BookmarkIcon className={routineLogDetail.isBookmarked ? 'fill-haru-brown text-haru-brown' : ''} size={20} />
          <span>{routineLogDetail.isBookmarked ? '북마크 취소' : '북마크'}</span>
        </Button>
      </div>
    </div>
  )
}

export default RoutineDetailPage
