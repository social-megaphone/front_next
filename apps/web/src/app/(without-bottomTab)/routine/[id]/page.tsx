import TopGoBackBar from '@/components/layout/topBar/TopGobackBar'
import RoutineDetailPage from '@/components/routine/RoutineDetail'

export default async function RoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const routineId = (await params).id

  return (
    <>
      <TopGoBackBar title="하루잇 Haru-It" subTitle="게시물" />
      <RoutineDetailPage id={routineId} />
    </>
  )
}
