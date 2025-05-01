// apps/web/src/components/routine/CommentSection.tsx
'use client'

import { Comment } from '@/apis/commentApi'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { useState } from 'react'

interface CommentSectionProps {
  comments: Comment[]
  isLoading: boolean
  isSubmitting: boolean
  onAddComment: (content: string) => void
}

export function CommentSection({ comments, isLoading, isSubmitting, onAddComment }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddComment(commentText)
    setCommentText('')
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      <h2 className="text-xl font-semibold">댓글 {comments.length}개</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-haru-brown"
          placeholder="댓글을 입력하세요"
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="bg-haru-brown text-white hover:bg-haru-brown/90"
          >
            {isSubmitting ? '등록 중...' : '댓글 등록'}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 mt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <CommentSkeleton key={index} />)
        ) : comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        ) : (
          <p className="text-center text-gray-500 py-4">첫 번째 댓글을 남겨보세요!</p>
        )}
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const date = new Date(comment.createdAt)
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  return (
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">{comment.nickname}</span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-700 mt-1">{comment.content}</p>
    </div>
  )
}

function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-3/4 mt-1" />
    </div>
  )
}
