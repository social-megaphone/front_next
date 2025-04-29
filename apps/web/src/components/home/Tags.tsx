'use client'
import { cn } from '@workspace/ui/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const tags = ['전체', '생활습관', '감정돌봄', '대인관계', '작은 습관', '작은 습관1', '작은 습관2']

export default function Tags() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedTag, setSelectedTag] = useState<string>('전체')

  useEffect(() => {
    const tagParam = searchParams.get('tag')
    if (tagParam && tags.includes(tagParam)) {
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
      {tags.map((tag) => (
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
