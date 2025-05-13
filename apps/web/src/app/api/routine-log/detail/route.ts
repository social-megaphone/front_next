import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/services/token.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token || !jwt_token.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const userId = await getUserIdFromToken({ token: jwt_token?.value || '' })
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
  const isLiked = routineLog?.likes.some((like) => like.userId === userId)
  const isBookmarked = routineLog?.bookmarks.some((bookmark) => bookmark.userId === userId)
  const formattedRoutineLog = {
    id: routineLog?.id,
    title: routineLog?.routine.title,
    desc: routineLog?.routine.desc,
    logImg: routineLog?.logImg,
    tag: routineLog?.routine.tag,
    reflection: routineLog?.reflection,
    performedAt: routineLog?.performedAt,
    user: {
      profileImage: routineLog?.user.profileImage || '/default-user.avif',
      nickname: routineLog?.user.nickname,
      userId: routineLog?.user.id,
    },
    routineId: routineLog?.routine.id,
    likeCount: routineLog?.likes.length || 0,
    commentCount: routineLog?.comments.length || 0,
    isLiked,
    isBookmarked,
    comments: routineLog?.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
      nickname: comment.user.nickname,
    })),
  }
  return NextResponse.json(formattedRoutineLog)
}
