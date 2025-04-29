'use client'
import { cn } from '@workspace/ui/lib/utils'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const tags = ['전체', '생활습관', '감정돌봄', '대인관계', '작은 습관']

export default function Tags() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    const tagParam = searchParams.get('tags')
    if (tagParam) {
      setSelectedTags(tagParam.split(','))
    } else {
      setSelectedTags(['전체'])
    }
  }, [searchParams])

  const handleTagClick = (tag: string) => {
    if (tag === '전체') {
      setSelectedTags(['전체'])
      router.push('/home')
      return
    }

    let newSelectedTags: string[]

    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      newSelectedTags = selectedTags.filter((t) => t !== tag)
      if (newSelectedTags.length === 0) {
        newSelectedTags = ['전체']
      }
    } else {
      // Add tag and remove '전체' if it exists
      newSelectedTags = selectedTags.filter((t) => t !== '전체')
      newSelectedTags.push(tag)
    }

    if (newSelectedTags.length === 0 || newSelectedTags.includes('전체')) {
      router.push('/home')
    } else {
      router.push(`/home?tags=${newSelectedTags.join(',')}`)
    }
  }

  return (
    <section
      className="flex items-center w-full justify-center gap-2 pl-10 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: 'none' }}
    >
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={cn(
            'text-sm px-3 py-1.5 rounded-full',
            tag === '전체' && selectedTags.includes('전체')
              ? 'bg-black text-white font-bold'
              : selectedTags.includes(tag) && tag !== '전체'
                ? 'bg-white text-black font-bold'
                : 'bg-white text-black font-bold',
          )}
        >
          {tag}
        </button>
      ))}
    </section>
  )
}
