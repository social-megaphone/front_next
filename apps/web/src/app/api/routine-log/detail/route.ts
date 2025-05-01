import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }
  const routineLog = await prisma.routineLog.findUnique({
    where: { id },
    include: {
      routine: true,
      user: true,
      likes: true,
      bookmarks: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  })
  const formattedRoutineLog = {
    id: routineLog?.id,
    title: routineLog?.routine.title,
    desc: routineLog?.routine.desc,
    logImg: routineLog?.logImg,
    tag: routineLog?.routine.tag,
    reflection: routineLog?.reflection,
    performedAt: routineLog?.performedAt,
    nickname: routineLog?.user.nickname,
    userId: routineLog?.user.id,
    routineId: routineLog?.routine.id,
    likeCount: routineLog?.likes.length || 0,
    commentCount: routineLog?.comments.length || 0,
    isLiked: routineLog?.likes.some((like) => like.userId === routineLog?.user.id),
    isBookmarked: routineLog?.bookmarks.some((bookmark) => bookmark.userId === routineLog?.user.id),
    comments: routineLog?.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
      nickname: comment.user.nickname,
    })),
  }
  console.log(formattedRoutineLog)
  return NextResponse.json(formattedRoutineLog)
}
