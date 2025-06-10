import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/services/token.service'
import { sendLikeNotification } from '@/services/noticification.service'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token || !jwt_token.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })
  const { routineLogId } = await request.json()

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        routineLogId,
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
      return NextResponse.json({ message: 'Like removed', liked: false })
    } else {
      // 좋아요 생성
      await prisma.like.create({
        data: {
          userId,
          routineLogId,
        },
      })

      // 좋아요를 누른 사용자와 루틴 로그 정보 가져오기
      const [liker, routineLog] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { nickname: true },
        }),
        prisma.routineLog.findUnique({
          where: { id: routineLogId },
          include: {
            user: { select: { id: true } },
            routine: { select: { title: true } },
          },
        }),
      ])

      // 자신의 루틴이 아닌 경우에만 알림 전송
      if (routineLog && liker && routineLog.userId !== userId) {
        await sendLikeNotification({
          targetUserId: routineLog.userId,
          likerNickname: liker.nickname,
          routineTitle: routineLog.routine.title,
        })
      }

      return NextResponse.json({ message: 'Like created', liked: true })
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json({ message: 'Failed to process like' }, { status: 500 })
  }
}
