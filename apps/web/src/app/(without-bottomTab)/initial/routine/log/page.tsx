'use client'
import Button_Haru from '@/components/ui/Haru/Button'
import Card_Haru from '@/components/ui/Haru/Card'
import LoadingCard from '@/components/ui/loadingCard'
import { LOG_PLACEHOLDER, LOG_TITLE, LOG_UPLOAD_BUTTON, LOG_UPLOAD_TITLE } from '@/constants/log.constant'
import useUploadImg from '@/hooks/query/useUploadImg'
import { useInitialStore } from '@/stores/useInitialStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { XIcon } from 'lucide-react'
import { useInit } from '@/hooks/query/useInit'
import UnoptimizedImage from '@/components/ image/UnoptimizedImage'
export default function RoutineLogPage() {
  const router = useRouter()
  const { initialInfo, setImgSrc, setReflection } = useInitialStore()

  const { mutate: uploadImg, isPending } = useUploadImg({ setAny: setImgSrc })
  const { init, isPending: isInitPending } = useInit()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImg(file)
    }
  }
  const handleDeleteImage = () => {
    setImgSrc('')
  }
  useEffect(() => {
    if (!initialInfo.goal || !initialInfo.nickname || !initialInfo.goalDate || !initialInfo.tags) {
      router.push('/initial')
    }
  }, [initialInfo, router])

  function handleSubmit() {
    if (!initialInfo.goal) {
      return
    }
    init({
      nickname: initialInfo.nickname,
      goalDate: initialInfo.goalDate,
      goal: initialInfo.goal,
      reflection: initialInfo.reflection,
      imgSrc: initialInfo.imgSrc ?? '/noImg.png',
    })
  }
  return (
    <>
      <div className="space-y-4 pt-16 relative">
        <div className="flex items-center justify-start w-full pb-10">
          <h1 className="text-3xl font-bold text-haru-brown whitespace-pre-line">{LOG_TITLE}</h1>
          <UnoptimizedImage
            src="/haru.png"
            className="absolute top-6 -right-4"
            alt="initial"
            width={150}
            height={150}
          />
        </div>
        <Card_Haru
          text={
            <div className="w-full px-4 flex flex-col text-sm gap-2 items-center">
              <h1 className="text-xl font-bold whitespace-nowrap">{initialInfo.goal?.title}</h1>
              <p className="px-4">{initialInfo.goal?.desc}</p>
              <div className="px-4 py-1 bg-[#FCE9B2] text-haru-brown rounded-xl w-fit">인증 방법</div>
              <div>{initialInfo.goal?.how}</div>
            </div>
          }
        />
        <div className="w-full">
          {initialInfo.imgSrc ? (
            <div className="bg-white shadow-haru w-full h-40 py-4 px-4 rounded-2xl text-lg relative overflow-hidden">
              <UnoptimizedImage src={initialInfo.imgSrc} alt="initial" fill className="object-cover" />
              <XIcon
                className="absolute top-4 bg-white rounded-full p-1 right-4 w-8 h-8 text-gray-500"
                onClick={handleDeleteImage}
              />
            </div>
          ) : (
            <div className="bg-white shadow-haru w-full h-40 py-4 px-4 rounded-2xl text-lg relative">
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-xl text-center px-6">{LOG_UPLOAD_TITLE}</p>
                <label className="px-4 py-1 text-sm rounded-xl bg-[#FCE9B2] text-haru-brown">
                  {LOG_UPLOAD_BUTTON}
                  <input type="file" onChange={(e) => handleImageChange(e)} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <input
            type="text"
            onChange={(e) => setReflection(e.target.value)}
            placeholder={LOG_PLACEHOLDER}
            className="bg-white shadow-haru w-full h-full py-4 px-4 rounded-2xl"
            value={initialInfo.reflection}
          />
        </div>
      </div>
      <Button_Haru disabled={!initialInfo.reflection || !initialInfo.imgSrc} onClick={handleSubmit}>
        다 했어요!
      </Button_Haru>
      {isPending && <LoadingCard text="사진 업로드 중..." />}
      {isInitPending && <LoadingCard text="하루 루틴 저장 중" />}
    </>
  )
}
