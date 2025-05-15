import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserIdFromToken } from '@/services/token.service'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag') || '전체'
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
  const cursor = request.nextUrl.searchParams.get('cursor') // 마지막 항목의 ID

  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token || !jwt_token.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  let whereCondition: any = {}
  const isAll = tag === '전체'

  if (!isAll) {
    whereCondition = {
      routine: {
        tag: {
          has: tag,
        },
      },
    }
  }

  try {
    const routineLogs = await prisma.routineLog.findMany({
      where: whereCondition,
      include: {
        routine: {
          select: {
            title: true,
            desc: true,
            tag: true,
            detailImg: true,
          },
        },
        user: {
          select: {
            nickname: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        performedAt: 'desc',
      },
      take: limit + 1, // 다음 페이지 여부 확인을 위해 +1
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1, // 커서 위치의 아이템은 제외
      }),
    })

    const hasMore = routineLogs.length > limit
    if (hasMore) {
      routineLogs.pop() // 추가로 가져온 마지막 아이템 제거
    }

    const formattedRoutineLogs = routineLogs.map((routineLog) => {
      const isLiked = routineLog.likes.some((like) => like.userId === userId)
      const isBookmarked = routineLog.bookmarks.some((bookmark) => bookmark.userId === userId)

      return {
        id: routineLog.id,
        userId: routineLog.userId,
        title: routineLog.routine.title,
        desc: routineLog.routine.desc || '',
        logImg: routineLog.logImg || '/noImg.png',
        tag: routineLog.routine.tag,
        performedAt: routineLog.performedAt,
        nickname: routineLog.user.nickname,
        liked: isLiked,
        bookmarked: isBookmarked,
        likeCount: routineLog.likes.length,
        reflection: routineLog.reflection,
      }
    })

    const nextCursor = hasMore ? routineLogs[routineLogs.length - 1]?.id : null

    return NextResponse.json({
      routineLogs: formattedRoutineLogs,
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Error fetching routines:', error)
    return NextResponse.json({ message: 'Failed to fetch routines' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { routineId, logImg, reflection } = await request.json()

  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token.value || !jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  try {
    const routineLog = await prisma.routineLog.create({
      data: {
        routineId,
        logImg,
        reflection,
        userId,
      },
    })

    return NextResponse.json({ message: 'success', routineLog })
  } catch (error) {
    console.error('루틴생성중 에러:', error)
    return NextResponse.json({ message: 'Failed to create routine log' }, { status: 500 })
  }
}
