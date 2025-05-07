import { uploadImage } from '@/apis/imageApi'
import { useMutation } from '@tanstack/react-query'
export default function useUploadImg({ setAny }: { setAny: (any: any) => void }) {
  return useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setAny(data.data[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
