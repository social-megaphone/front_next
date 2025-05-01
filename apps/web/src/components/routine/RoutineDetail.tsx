'use client'
import { useToggleLike } from '@/hooks/query/useRoutineStatus'
import { useToggleBookmark } from '@/hooks/query/useBookmarks'
import { Button } from '@workspace/ui/components/button'
import { HeartIcon, BookmarkIcon, MessageSquareIcon } from 'lucide-react'
import Image from 'next/image'
import { useRoutineLogDetail } from '@/hooks/query/useRoutineLogs'
import { useRouter } from 'next/navigation'
import { CommentSection } from './CommentSection'
import { useComments } from '@/hooks/query/useComments'

function RoutineDetailPage({ id }: { id: string }) {
  const { mutate: toggleLike } = useToggleLike()
  const { mutate: toggleBookmark } = useToggleBookmark()
  const { routineLogDetail, isPending: isLoading } = useRoutineLogDetail({ id })
  const { comments, isLoading: isCommentsLoading, isSubmitting, handleAddComment } = useComments(id)

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

  const performedDate = new Date(routineLogDetail.performedAt)
  // 현재 시간과의 차이 계산
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - performedDate.getTime()) / (1000 * 60 * 60))

  let formattedDate = ''
  if (diffInHours < 24) {
    // 24시간 이내면 "N시간 전"
    formattedDate = `${diffInHours}시간 전`
  } else if (diffInHours < 48) {
    // 48시간 이내면 "어제"
    formattedDate = '어제'
  } else {
    formattedDate = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(performedDate)
  }

  return (
    <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto h-full" style={{ scrollbarWidth: 'none' }}>
      <div className="relative shrink-0 w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={routineLogDetail?.logImg || '/noImg.png'}
          alt={routineLogDetail?.title || 'routine image'}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{routineLogDetail?.title}</h1>
          <span className="px-3 py-1 bg-haru-brown text-white rounded-full text-sm">{routineLogDetail?.tag}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">{routineLogDetail?.nickname}님의 루틴</p>
          <p className="text-gray-500 text-xs">{formattedDate}</p>
        </div>

        {routineLogDetail?.reflection && <p className="text-gray-700">{routineLogDetail.reflection}</p>}
        {/* <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={handleLike} className="flex items-center gap-2">
            <HeartIcon className={routineLogDetail.isLiked ? 'fill-red-500 text-red-500' : ''} size={20} />
            <span>{routineLogDetail.likeCount}</span>
          </Button>
          <Button variant="ghost" onClick={handleBookmark} className="flex items-center gap-2">
            <BookmarkIcon
              className={routineLogDetail.isBookmarked ? 'fill-haru-brown text-haru-brown' : ''}
              size={20}
            />
          </Button>
        </div> */}
      </div>

      <CommentSection
        comments={comments}
        isLoading={isCommentsLoading}
        isSubmitting={isSubmitting}
        onAddComment={handleAddComment}
      />
    </div>
  )
}

export default RoutineDetailPage
