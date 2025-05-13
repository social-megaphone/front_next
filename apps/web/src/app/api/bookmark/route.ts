import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/services/token.service'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token || !jwt_token.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })
  const { routineLogId } = await request.json()

  try {
    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        routineLogId,
      },
    })

    if (existingBookmark) {
      // 이미 북마크가 있으면 삭제 (북마크 취소)
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      })
      return NextResponse.json({ message: 'Bookmark removed', bookmarked: false })
    } else {
      // 북마크가 없으면 생성
      await prisma.bookmark.create({
        data: {
          userId,
          routineLogId,
        },
      })
      return NextResponse.json({ message: 'Bookmark created', bookmarked: true })
    }
  } catch (error) {
    console.error('Error handling bookmark:', error)
    return NextResponse.json({ message: 'Failed to process bookmark' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token')

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        routineLog: {
          include: {
            user: {
              select: {
                nickname: true,
              },
            },
            routine: {
              select: {
                title: true,
                desc: true,
                tag: true,
              },
            },
            likes: {
              select: {
                id: true,
                userId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedBookmarks = bookmarks.map((bookmark) => {
      const isLiked = bookmark.routineLog.likes.some((like) => like.userId === userId)

      return {
        id: bookmark.routineLog.id,
        nickname: bookmark.routineLog.user.nickname,
        title: bookmark.routineLog.routine.title,
        desc: bookmark.routineLog.routine.desc || '',
        logImg: bookmark.routineLog.logImg || '/noImg.png',
        tag: bookmark.routineLog.routine.tag,
        performedAt: bookmark.routineLog.performedAt,
        bookmarkId: bookmark.id,
        isBookmarked: true,
        liked: isLiked,
        reflection: bookmark.routineLog.reflection,
        likeCount: bookmark.routineLog.likes.length,
      }
    })

    return NextResponse.json({ bookmarks: formattedBookmarks })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ message: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}
