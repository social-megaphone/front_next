'use client'

import { getMyProfile } from '@/apis'
import UnoptimizedImage from '@/components/ image/UnoptimizedImage'
import TopGoBackBar from '@/components/layout/topBar/TopGobackBar'
import { useEffect, useState } from 'react'

export default function MypagePage() {
  const requiredExp = 2100
  const myExp = 400
  const [myProfile, setMyProfile] = useState<any>()
  useEffect(() => {
    async function get() {
      const response = await getMyProfile()
      setMyProfile(response.data)
    }
    get()
  }, [])
  if (!myProfile) {
    return <div>로딩중</div>
  }
  return (
    <div>
      <TopGoBackBar title="하루잇 Haru-It" subTitle="내 프로필" />
      {JSON.stringify(myProfile, null, 2)}
      <div className="w-full h-52 p-4">
        <div className="w-full h-full bg-white overflow-hidden rounded-3xl">
          <div className="w-full pr-6 flex">
            <div className="w-20 h-20">
              <UnoptimizedImage src={myProfile.profileImage || '/default-user.avif'} width={80} height={80} alt="aa" />
            </div>
            <div className="flex-1 relative h-20 pl-2 pt-4">
              <p className="text-lg">{myProfile.nickname}</p>
              <div className="absolute h-1 w-full bg-gray-200 rounded-full" />
              <div
                style={{ width: `${(myExp / requiredExp) * 100}%` }}
                className="absolute h-1 bg-blue-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
