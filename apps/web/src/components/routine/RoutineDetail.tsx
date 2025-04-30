'use client'
import { useRoutineStatus, useToggleLike } from '@/hooks/query/useRoutineStatus'
import { useToggleBookmark } from '@/hooks/query/useBookmarks'
import { useRoutineStatusStore } from '@/stores/useRoutineStatusStore'
import { Button } from '@workspace/ui/components/button'
import { HeartIcon, BookmarkIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
function RoutineDetailPage({ id }: { id: string }) {
  const { mutate: toggleLike } = useToggleLike()
  const { mutate: toggleBookmark } = useToggleBookmark()
  const { isPending } = useRoutineStatus(id)
  const { isLiked, isBookmarked, likeCount } = useRoutineStatusStore()
  const [routine, setRoutine] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setRoutine({
        id: id,
        title: '샘플 루틴',
        desc: '이 루틴은 샘플 루틴입니다. 실제 API 연동 시 서버에서 데이터를 가져옵니다.',
        thumbnail: '/haru_smile.png',
        tag: '생활습관',
        nickname: '유쾌한 토끼',
      })
      setLoading(false)
    }, 500)
  }, [id])

  const handleLike = () => {
    toggleLike(id)
  }

  const handleBookmark = () => {
    toggleBookmark(id)
  }

  if (loading || isPending) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <p>로딩 중...</p>
      </div>
    )
  }
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image src={routine.thumbnail} alt={routine.title} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{routine.title}</h1>
          <span className="px-3 py-1 bg-haru-brown text-white rounded-full text-sm">{routine.tag}</span>
        </div>
        <p className="text-gray-600 text-sm">{routine.nickname}님의 루틴</p>
        <p className="mt-2">{routine.desc}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleLike} className="flex items-center gap-2">
            <HeartIcon className={isLiked ? 'fill-red-500 text-red-500' : ''} size={20} />
            <span>{likeCount}</span>
          </Button>
        </div>
        <Button variant="ghost" onClick={handleBookmark} className="flex items-center gap-2">
          <BookmarkIcon className={isBookmarked ? 'fill-haru-brown text-haru-brown' : ''} size={20} />
          <span>{isBookmarked ? '북마크 취소' : '북마크'}</span>
        </Button>
      </div>
    </div>
  )
}

export default RoutineDetailPage
