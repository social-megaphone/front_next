'use client'
import { TAGS } from '@/constants'
import { cn } from '@workspace/ui/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Tags() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedTag, setSelectedTag] = useState<string>('전체')

  useEffect(() => {
    const tagParam = searchParams.get('tag')
    if (tagParam && TAGS.includes(tagParam)) {
      setSelectedTag(tagParam)
    } else {
      setSelectedTag('전체')
    }
  }, [searchParams])

  const handleTagClick = (tag: string) => {
    if (tag === selectedTag) {
      return
    }

    setSelectedTag(tag)

    if (tag === '전체') {
      router.push('/home')
    } else {
      router.push(`/home?tag=${tag}`)
    }
  }

  return (
    <section
      className="flex items-center w-full justify-start gap-2 pl-6 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: 'none' }}
    >
      <Tag tag="전체" isSelected={selectedTag === '전체'} handleTagClick={handleTagClick} />

      {TAGS.map((tag) => (
        <Tag key={tag} tag={tag} isSelected={selectedTag === tag} handleTagClick={handleTagClick} />
      ))}
    </section>
  )
}

function Tag({
  tag,
  isSelected,
  handleTagClick,
}: {
  tag: string
  isSelected: boolean
  handleTagClick: (tag: string) => void
}) {
  return (
    <button
      onClick={() => handleTagClick(tag)}
      className={cn(
        'text-sm px-3 py-1.5 rounded-full',
        isSelected ? 'bg-black text-white font-bold' : 'bg-white text-black font-bold',
      )}
    >
      {tag}
    </button>
  )
}
