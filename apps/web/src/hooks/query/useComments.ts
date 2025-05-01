import { addComment, getComments, type Comment, type CommentRequest } from '@/apis/commentApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useComments = (routineLogId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['comments', routineLogId],
    queryFn: () => getComments(routineLogId),
    enabled: !!routineLogId,
  })
  useEffect(() => {
    if (data) {
      setComments(data)
    }
  }, [data])

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      console.log(newComment)
      setComments((prev) => [newComment, ...prev])
      queryClient.invalidateQueries({ queryKey: ['comments', routineLogId] })
    },
  })

  const handleAddComment = (content: string) => {
    if (!content.trim()) return

    const commentRequest: CommentRequest = {
      routineLogId,
      content: content.trim(),
    }

    submitComment(commentRequest)
  }

  return {
    comments,
    isLoading,
    isSubmitting,
    handleAddComment,
  }
}
