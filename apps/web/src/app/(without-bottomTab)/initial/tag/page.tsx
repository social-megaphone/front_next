'use client'
import UnoptimizedImage from '@/components/ image/UnoptimizedImage'
import Button_Haru from '@/components/ui/Haru/Button'
import Card_Haru from '@/components/ui/Haru/Card'
import { TAGS } from '@/constants'
import { useInitialStore } from '@/stores/useInitialStore'
import { cn } from '@workspace/ui/lib/utils'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TagPage() {
  const router = useRouter()
  const setTags = useInitialStore((s) => s.setTags)
  const nickname = useInitialStore((s) => s.initialInfo.nickname)
  const goalDate = useInitialStore((s) => s.initialInfo.goalDate)

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }
  useEffect(() => {
    if (!nickname || !goalDate) {
      router.push('/initial')
    }
  }, [nickname, goalDate, router])

  return (
    <>
      <div className="flex-1 w-full flex flex-col items-center justify-center -space-y-8">
        <UnoptimizedImage src="/haru.png" alt="initial" width={180} height={180} className="z-10" />
        <Card_Haru
          text={
            <span className="font-bold">
              우와, 정말 멋진 걸요?
              <br />
              <p className="mt-2">
                하루잇에서 시도해보고 싶은 <br /> 목표 태그를 골라주세요.
              </p>
            </span>
          }
        />
        <div className="grid grid-cols-3 w-full mt-12 h-52 gap-2">
          {TAGS.map((tag) => (
            <div
              onClick={() => handleTagClick(tag)}
              key={tag}
              className={cn(
                'w-full bg-white rounded-2xl flex items-center transition-all duration-200 justify-center text-base font-semibold shadow-lg',
                selectedTags.includes(tag) ? 'bg-haru-brown/80 text-white' : '',
              )}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <Button_Haru
        disabled={selectedTags.length === 0}
        onClick={() => {
          setTags(selectedTags)
          router.push('/initial/routine')
        }}
      >
        확인
      </Button_Haru>
    </>
  )
}
