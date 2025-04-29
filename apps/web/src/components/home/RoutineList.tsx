'use client'

import { useBoard } from '@/hooks/query/useBoard'
import { Post, useBoardStore } from '@/stores/useBoardStore'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import PostCard from '../ui/postcard'

export default function RoutineList() {
  const searchParams = useSearchParams()
  const tags = searchParams.get('tags')
  // const [tagsArray, setTagsArray] = useState<string[]>(tags ? tags.split(',') : [])
  useBoard({ tags: [] })
  const { posts } = useBoardStore()
  console.log(posts)
  return (
    <div className="flex flex-col gap-4 p-4 px-8 h-full overflow-y-auto last:mb-16">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
