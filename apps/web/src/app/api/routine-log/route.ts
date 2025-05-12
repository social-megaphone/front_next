import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserIdFromToken } from '@/services/token.service'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag') || '전체'

  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token')

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  let routineLogs = []
  const isAll = tag === '전체'

  try {
    if (isAll) {
      routineLogs = await prisma.routineLog.findMany({
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
      })
    } else {
      routineLogs = await prisma.routineLog.findMany({
        where: {
          routine: {
            tag: tag,
          },
        },
        include: {
          routine: {
            select: {
              title: true,
              desc: true,
              tag: true,
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
      })
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

    return NextResponse.json({ routineLogs: formattedRoutineLogs })
  } catch (error) {
    console.error('Error fetching routines:', error)
    return NextResponse.json({ message: 'Failed to fetch routines' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { routineId, logImg, reflection } = await request.json()

  const cookieStore = await cookies()
  let jwt_token = cookieStore.get('jwt_token')

  // 이거 전체에 추가
  if (!jwt_token) {
    jwt_token.value = request.headers.get('Authorization')?.split(' ')[1]
  }
  if (!jwt_token) {
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
