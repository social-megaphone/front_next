export default async function RoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>루틴 상세 페이지, 루틴 아이디: {id}</div>
}
