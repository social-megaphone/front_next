'use client'
import { useToggleLike } from '@/hooks/query/useRoutineStatus'
import { useToggleBookmark } from '@/hooks/query/useBookmarks'
import { Button } from '@workspace/ui/components/button'
import { HeartIcon, BookmarkIcon, MessageSquareIcon } from 'lucide-react'
import { useRoutineLogDetail } from '@/hooks/query/useRoutineLogs'
import { useRouter } from 'next/navigation'
import { CommentSection } from './CommentSection'
import { useComments } from '@/hooks/query/useComments'
import { Skeleton } from '@workspace/ui/components/skeleton'
import UnoptimizedImage from '../ image/UnoptimizedImage'

function RoutineDetailPage({ id }: { id: string }) {
  const { mutate: toggleLike } = useToggleLike()
  const { mutate: toggleBookmark } = useToggleBookmark()
  const { routineLogDetail, isPending: isLoading, setRoutineLogDetail } = useRoutineLogDetail({ id })
  const { comments, isLoading: isCommentsLoading, isSubmitting, handleAddComment } = useComments(id)

  const router = useRouter()
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col flex-1 h-full">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="mt-4 w-full aspect-video rounded-xl" />
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-1">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-20 w-full mt-2" />
        </div>
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
  const handleLike = () => {
    toggleLike(id)
    const newRoutineLogDetail = { ...routineLogDetail, isLiked: !routineLogDetail?.isLiked }
    setRoutineLogDetail(newRoutineLogDetail)
  }

  const handleBookmark = () => {
    toggleBookmark(id)
    const newRoutineLogDetail = { ...routineLogDetail, isBookmarked: !routineLogDetail?.isBookmarked }
    setRoutineLogDetail(newRoutineLogDetail)
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
    <div className="p-6 flex flex-col flex-1 overflow-y-auto h-full" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-center gap-2">
        <UnoptimizedImage
          src={routineLogDetail.user.profileImage || '/default-user.avif'}
          alt={routineLogDetail.user.nickname}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-3xl font-bold">
          <span className="text-haru-brown">{routineLogDetail.user.nickname}님</span>의 잇루틴
        </span>
      </div>
      <div className="relative shrink-0 mt-4 w-full aspect-video rounded-xl overflow-hidden">
        <UnoptimizedImage
          src={routineLogDetail?.logImg || '/noImg.png'}
          alt={routineLogDetail?.title || 'routine image'}
          fill
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-1">
          <HeartIcon
            onClick={handleLike}
            className={routineLogDetail.isLiked ? 'fill-red-500 text-red-500' : ''}
            size={24}
          />
          <MessageSquareIcon size={24} />
        </div>

        <BookmarkIcon
          onClick={handleBookmark}
          className={routineLogDetail.isBookmarked ? 'fill-haru-brown text-haru-brown' : ''}
          size={24}
        />
      </div>

      <div className="w-full rounded-xl mt-4 p-4 bg-[#FFFBED] border-haru-brown border relative flex flex-col justify-center items-start gap-2">
        <div className="px-3 bg-blue-400 text-white rounded-full font-medium">{routineLogDetail.title}</div>
        <div className="text-base font-medium pr-4 leading-5" style={{ whiteSpace: 'pre-wrap' }}>
          {routineLogDetail.reflection}
        </div>
        <div className="absolute bottom-2 right-2 w-20 h-6 bg-haru-brown/50 rounded-full"></div>
      </div>

      {/* <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{routineLogDetail?.title}</h1>
          <span className="px-3 py-1 bg-haru-brown text-white rounded-full text-sm">{routineLogDetail?.tag}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">{routineLogDetail?.nickname}님의 루틴</p>
          <p className="text-gray-500 text-xs">{formattedDate}</p>
        </div>

        {routineLogDetail?.reflection && <p className="text-gray-700">{routineLogDetail.reflection}</p>}
      </div> */}

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
