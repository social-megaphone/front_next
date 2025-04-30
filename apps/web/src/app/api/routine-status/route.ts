import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/services/token.service'

export async function GET(request: NextRequest) {
  const routineId = request.nextUrl.searchParams.get('routineId')

  if (!routineId) {
    return NextResponse.json({ message: 'Routine ID is required' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token')

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  try {
    // 좋아요 상태 확인
    const like = await prisma.like.findFirst({
      where: {
        userId,
        routineId,
      },
    })

    // 북마크 상태 확인
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        routineId,
      },
    })

    // 좋아요 수 카운트
    const likeCount = await prisma.like.count({
      where: {
        routineId,
      },
    })

    return NextResponse.json({
      isLiked: !!like,
      isBookmarked: !!bookmark,
      likeCount,
    })
  } catch (error) {
    console.error('Error fetching routine status:', error)
    return NextResponse.json({ message: 'Failed to fetch routine status' }, { status: 500 })
  }
}
