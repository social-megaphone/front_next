import RoutineList from '@/components/home/RoutineList'
import Tags from '@/components/home/Tags'
import TopAlarm from '@/components/layout/topBar/TopAlarm'
import Image from 'next/image'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <main className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <TopAlarm />
      <section className="flex pt-16 pb-4 items-end justify-center pr-4">
        <p className="text-3xl font-bold text-haru-brown mb-3">
          함께하는 <br /> 하루잇러들
        </p>
        <Image src="/haru_smile.png" alt="haru" width={132} height={132} />
      </section>

      <Suspense fallback={<div>Loading...</div>}>
        <Tags />
        <RoutineList />
      </Suspense>
    </main>
  )
}
