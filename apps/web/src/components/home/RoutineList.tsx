'use client'

import { useBoard } from '@/hooks/query/useBoard'
import { useBoardStore } from '@/stores/useBoardStore'
import { useSearchParams } from 'next/navigation'
import PostCard from '../ui/postcard'
import { useEffect, useState } from 'react'

export default function RoutineList() {
  const searchParams = useSearchParams()
  const tagParam = searchParams.get('tag')
  const [tag, setTag] = useState(tagParam ?? '전체')

  useEffect(() => {
    setTag(tagParam ?? '전체')
  }, [tagParam])

  useBoard({ tag })
  const { posts } = useBoardStore()

  return (
    <div className="flex flex-col gap-4 p-4 px-8 h-full overflow-y-auto last:mb-16">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
