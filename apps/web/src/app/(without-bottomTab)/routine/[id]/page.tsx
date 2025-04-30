import RoutineDetailPage from '@/components/routine/RoutineDetail'

export default async function RoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const routineId = (await params).id

  return <RoutineDetailPage id={routineId} />
}
