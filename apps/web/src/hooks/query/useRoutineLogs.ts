import { getRoutineLog, getRoutineLogDetail } from '@/apis'
import { RoutineLogType, useRoutineLogStore } from '@/stores/useRoutineLogStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useRoutineLogs = ({ tag }: { tag: string }) => {
  const setRoutineLogs = useRoutineLogStore((state) => state.setRoutineLogs)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['routineLogs', tag],
    queryFn: () => getRoutineLog(tag),
    staleTime: 10 * 10 * 1000,
    gcTime: 20 * 10 * 1000,
    enabled: !!tag,
  })

  useEffect(() => {
    if (data) {
      setRoutineLogs(data.routineLogs)
    }
  }, [data, setRoutineLogs])

  return { isPending: isLoading, refetch }
}

interface RoutineLogDetail extends RoutineLogType {
  routineId: string
  likeCount: number
  commentCount: number
  isLiked: boolean
  isBookmarked: boolean
  user: {
    userId: string
    profileImage: string
    nickname: string
  }
  //comment 속성 정의해야함
  comments: any[]
}

export const useRoutineLogDetail = ({ id }: { id: string }) => {
  const [routineLogDetail, setRoutineLogDetail] = useState<RoutineLogDetail | null>(null)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['routineLogDetail', id],
    queryFn: () => getRoutineLogDetail(id),
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (data) {
      setRoutineLogDetail(data)
    }
  }, [data])

  return { routineLogDetail, setRoutineLogDetail, isPending: isLoading, refetch }
}
