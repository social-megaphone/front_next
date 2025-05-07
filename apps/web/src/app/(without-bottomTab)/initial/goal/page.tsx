'use client'
import UnoptimizedImage from '@/components/ image/UnoptimizedImage'
import NumberPicker from '@/components/initial/NumberPicker'
import Button_Haru from '@/components/ui/Haru/Button'
import Card_Haru from '@/components/ui/Haru/Card'
import { useInitialStore } from '@/stores/useInitialStore'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function GoalPage() {
  const router = useRouter()
  const initialInfo = useInitialStore((s) => s.initialInfo)
  const setGoalDate = useInitialStore((s) => s.setGoalDate)
  const [isClicked, setIsClicked] = useState<boolean>(false)
  useEffect(() => {
    if (!initialInfo.nickname) {
      router.push('/initial')
    }
  }, [initialInfo, router])
  return (
    <>
      <div className="flex-1 w-full flex flex-col items-center justify-center -space-y-8">
        <UnoptimizedImage src="/haru.png" alt="initial" width={180} height={180} className="z-10" />
        <div className={`w-full ${isClicked ? 'hidden' : 'flex'}`}>
          <Card_Haru
            text={
              <p>
                내가 그리는 나의 모습,
                <br /> 하루잇 일기장에 남겨볼까요?
              </p>
            }
          />
        </div>
        <div
          className={`flex items-center text-center justify-center py-20 px-4 bg-white w-full rounded-3xl shadow-lg transition-all duration-300 ${
            isClicked ? 'mt-0' : 'mt-12'
          }`}
          style={{ whiteSpace: 'pre-line' }}
        >
          <div className="text-xl font-bold">
            저는{' '}
            <button
              onClick={() => setIsClicked(!isClicked)}
              className={`w-16 text-sm border-b-2 border-black ${isClicked ? 'text-black' : 'text-gray-300'}`}
            >
              {isClicked ? initialInfo.goalDate : '입력'}
            </button>{' '}
            일 동안 <br />
            <div className="p-2 w-full">
              {isClicked && <NumberPicker goalDate={initialInfo.goalDate} setGoalDate={setGoalDate} />}
            </div>
            루틴에 도전해볼게요.
          </div>
        </div>
      </div>
      <Button_Haru disabled={!isClicked} onClick={() => router.push('/initial/tag')}>
        확인
      </Button_Haru>
    </>
  )
}
