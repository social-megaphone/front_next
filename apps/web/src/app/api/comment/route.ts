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
  const { routineLogId, content } = await request.json()

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    const routineLog = await prisma.routineLog.findUnique({
      where: { id: routineLogId },
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

    return NextResponse.json({
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      userId: newComment.userId,
      nickname: user.nickname, // Using the user fetched earlier
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ message: 'Failed to create comment', error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const routineLogId = searchParams.get('routineLogId')

  if (!routineLogId) {
    return NextResponse.json({ message: 'routineLogId is required' }, { status: 400 })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        logId: routineLogId,
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
      nickname: comment.user.nickname,
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 })
  }
}
