'use client'
import Card_Haru from '@/components/ui/Haru/Card'
import { colors } from '@/constants'
import { useInitialStore } from '@/stores/useInitialStore'
import { ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import { useEffect, useState } from 'react'
import useRoutine from '@/hooks/query/useRoutine'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { RoutineType } from '@/types/initType'
import UnoptimizedImage from '@/components/ image/UnoptimizedImage'
export default function RoutinePage() {
  const router = useRouter()
  const { initialInfo, setGoal } = useInitialStore()
  const myTag = initialInfo.tags[0]
  // 일단 태그 없이 검색하게하자
  const { data: routineData, isLoading } = useRoutine('')
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineType | null>(null)
  const handleRoutineClick = (tag: RoutineType) => {
    setGoal(tag)
    router.push('/initial/routine/log')
  }

  useEffect(() => {
    if (initialInfo.tags.length <= 0 || !myTag || !initialInfo.nickname || !initialInfo.goalDate) {
      router.push('/initial')
    }
  }, [initialInfo, router])

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="flex flex-col w-full shrink-0 items-center justify-center -space-y-8">
        <UnoptimizedImage src="/haru.png" alt="initial" width={180} height={180} className="z-10" />
        <Card_Haru
          text={
            <span>
              가장 해보고 싶은 루틴을
              <br />
              1개 선택해볼까요?
              <p className="mt-3 text-sm text-gray-500">루틴을 누르면 자세한 설명을 볼 수 있어요.</p>
            </span>
          }
        />
      </div>
      <div className="w-screen flex justify-center flex-1">
        <div
          className="max-w-md w-full -mb-10 mt-8 flex-1 rounded-t-3xl bg-background-yellow p-4 flex flex-col"
          style={{
            boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.15) inset',
          }}
        >
          <div
            className="flex flex-col overflow-y-auto p-4 w-full"
            style={{
              flex: '1 0 0',
              scrollbarColor: '#7a634b',
              scrollbarWidth: 'thin',
            }}
          >
            <div className="px-12 py-1 rounded-full bg-haru-brown text-white font-bold text-lg self-center">
              추천 루틴
            </div>
            <div className="flex flex-col gap-2 w-full mt-4">
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="w-full h-10 rounded-full" />
                  ))}
                </>
              ) : (
                routineData?.map((tag: RoutineType) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedRoutine(tag)}
                    className="shadow-sm w-full py-2 flex rounded-full bg-white items-center px-4 justify-between"
                  >
                    <div className="text-xl">{tag.icon}</div>
                    <div className="text-lg font-bold">{tag.title}</div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedRoutine && (
        <div
          onClick={() => setSelectedRoutine(null)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
        >
          <div className={`px-4 max-w-md`}>
            <div
              className={`rounded-lg p-10 relative ${colors[selectedRoutine.color as keyof typeof colors].bgColor} w-full`}
            >
              <button
                onClick={() => setSelectedRoutine(null)}
                className="absolute top-4 right-4 text-gray-700 hover:text-black"
              >
                ✕
              </button>
              <h2
                className={`text-3xl font-bold ${colors[selectedRoutine.color as keyof typeof colors].textColor} whitespace-pre-wrap`}
              >
                {selectedRoutine.title}
              </h2>
              <p className="text-lg font-medium leading-6 text-black mt-2">{selectedRoutine.desc}</p>
              <Button
                onClick={() => handleRoutineClick(selectedRoutine)}
                variant="outline"
                className="mt-4 px-4 py-2 rounded-full w-fit"
              >
                도전 해볼래요!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
