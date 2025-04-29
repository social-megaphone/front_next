import { useMutation } from '@tanstack/react-query'
import { postInitial } from '@/apis'
import useUserStore from '@/stores/useUserStore'
import { useRouter } from 'next/navigation'

const useInitMutation = () => {
  const setUser = useUserStore((state) => state.setUser)
  const router = useRouter()
  return useMutation({
    mutationFn: postInitial,
    onSuccess: (data) => {
      setUser({
        nickName: data.nickname,
        profileImage: data.profileImage,
      })
      router.push('/home')
    },
  })
}

export const useInit = () => {
  const { mutate: init, isPending } = useInitMutation()

  return { init, isPending }
}
