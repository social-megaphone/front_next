import Tags from '@/components/home/Tags'
import TopAlarm from '@/components/layout/topBar/TopAlarm'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main>
      <TopAlarm />
      <section className="flex pt-20 items-end justify-center">
        <p className="text-3xl font-bold text-haru-brown mb-3">
          함께하는 <br /> 하루잇러들
        </p>
        <Image src="/haru_smile.png" alt="haru" width={132} height={132} />
      </section>

      <Tags />
    </main>
  )
}
