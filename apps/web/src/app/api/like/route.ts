import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/services/token.service'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token')

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })
  const { routineId } = await request.json()

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        routineId,
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
      await prisma.like.create({
        data: {
          userId,
          routineId,
        },
      })
      return NextResponse.json({ message: 'Like created', liked: true })
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json({ message: 'Failed to process like' }, { status: 500 })
  }
}
