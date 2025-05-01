'use client'

import { Comment } from '@/apis/commentApi'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { useState } from 'react'
import { ChevronLeft, Send, Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet'

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

  const previewComments = comments.slice(0, 3)

  return (
    <div className="flex flex-col mt-6">
      {/* 댓글 미리보기 영역 */}
      <div className="bg-amber-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">댓글 {comments.length}개</h2>
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-gray-500 text-sm">댓글 모두 보기</button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-center">댓글</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 pb-20">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => <CommentSkeleton key={index} />)
                ) : comments.length > 0 ? (
                  comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
                ) : (
                  <p className="text-center text-gray-500 py-4">첫 번째 댓글을 남겨보세요!</p>
                )}
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <textarea
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-haru-brown resize-none"
                    placeholder="댓글을 입력하세요"
                    rows={1}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSubmitting || !commentText.trim()}
                    className="bg-haru-brown text-white hover:bg-haru-brown/90 rounded-full h-10 w-10 p-0"
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 댓글 미리보기 */}
        <div className="flex flex-col gap-2">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, index) => <CommentSkeleton key={index} />)
          ) : previewComments.length > 0 ? (
            previewComments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-1">
                <div className="flex items-start">
                  <span className="font-medium text-sm">{comment.nickname}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
                <div className="h-px bg-amber-100 w-full mt-2 mb-1"></div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-2 text-sm">첫 번째 댓글을 남겨보세요!</p>
          )}
        </div>

        {/* 댓글 입력 영역 */}
        <div className="mt-3">
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-haru-brown"
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !commentText.trim()}
              size="sm"
              className="bg-haru-brown text-white hover:bg-haru-brown/90 rounded-full h-8 px-3 text-xs"
            >
              등록
            </Button>
          </div>
        </div>
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
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-100">
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
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-3/4 mt-1" />
    </div>
  )
}
