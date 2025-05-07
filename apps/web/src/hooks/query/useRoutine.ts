import { getRoutine } from '@/apis/routineApi'
import { useQuery } from '@tanstack/react-query'

const useRoutineQuery = (tag: string) => {
  return useQuery({
    queryKey: ['routine', tag],
    queryFn: () => getRoutine(tag),
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 60 * 24,
  })
}
export default function useRoutine(tag: string) {
  const { data, isLoading, error } = useRoutineQuery(tag)

  return { data, isLoading, error }
}
