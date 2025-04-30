import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserIdFromToken } from '@/services/token.service'

export async function POST(request: Request) {
  const body = await request.json()
  const { tag } = body

  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token')

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  let routines = []
  const isAll = tag === '전체'

  try {
    if (isAll) {
      routines = await prisma.routine.findMany({
        include: {
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
      })
    } else {
      routines = await prisma.routine.findMany({
        where: {
          tag: tag,
        },
        include: {
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
      })
    }

    const formattedRoutines = routines.map((routine) => {
      const isLiked = routine.likes.some((like) => like.userId === userId)
      const isBookmarked = routine.bookmarks.some((bookmark) => bookmark.userId === userId)

      return {
        id: routine.id,
        userId: routine.userId,
        title: routine.title,
        desc: routine.desc || '',
        thumbnailImg: routine.thumbnailImg || '/noImg.png',
        tag: routine.tag,
        createdAt: routine.createdAt,
        nickname: routine.user.nickname,
        liked: isLiked,
        bookmarked: isBookmarked,
        likeCount: routine.likes.length,
      }
    })

    return NextResponse.json({ routines: formattedRoutines })
  } catch (error) {
    console.error('Error fetching routines:', error)
    return NextResponse.json({ message: 'Failed to fetch routines' }, { status: 500 })
  }
}
