// apps/web/src/app/api/comment/route.ts (POST 부분만 수정)
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/services/token.service'
import { sendCommentNotification } from '@/services/noticification.service'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token || !jwt_token.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })
  const { routineLogId, content } = await request.json()

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    const routineLog = await prisma.routineLog.findUnique({
      where: { id: routineLogId },
      include: {
        user: { select: { id: true } },
        routine: { select: { title: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (!routineLog) {
      return NextResponse.json({ message: 'Routine log not found' }, { status: 404 })
    }

    const newComment = await prisma.comment.create({
      data: {
        logId: routineLogId,
        userId: userId,
        content,
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    })

    // 자신의 루틴이 아닌 경우에만 알림 전송
    if (routineLog.userId !== userId) {
      await sendCommentNotification({
        targetUserId: routineLog.userId,
        commenterNickname: user.nickname,
        routineTitle: routineLog.routine.title,
        comment: content,
      })
    }

    return NextResponse.json({
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      userId: newComment.userId,
      nickname: user.nickname,
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ message: 'Failed to create comment', error: String(error) }, { status: 500 })
  }
}

// GET 함수는 기존과 동일...
