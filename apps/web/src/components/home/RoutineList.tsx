'use client'

import { useBoard } from '@/hooks/query/useBoard'
import { useBoardStore } from '@/stores/useBoardStore'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import PostCard from '../ui/PostCard'
import { PostCardSkeleton } from '../ui/PostCard/Skeleton'
export default function RoutineList() {
  const searchParams = useSearchParams()
  const tagParam = searchParams.get('tag')
  const [tag, setTag] = useState(tagParam ?? '전체')

  useEffect(() => {
    setTag(tagParam ?? '전체')
  }, [tagParam])

  const { isPending } = useBoard({ tag })
  const { posts } = useBoardStore()

  return (
    <div className="flex flex-col gap-6 py-4 px-6 flex-1 last:mb-20">
      {isPending ? (
        Array.from({ length: 3 }).map((_, index) => <PostCardSkeleton key={index} />)
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="flex flex-col gap-4 p-4 flex-1 last:mb-20">
          <p className="text-center text-gray-500 text-lg">등록된 잇루틴이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
