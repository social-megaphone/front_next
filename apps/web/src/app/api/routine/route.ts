import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/services/token.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag') || ''
  let routines = []
  if (tag) {
    routines = await prisma.routine.findMany({
      where: {
        tag: {
          has: tag,
        },
      },
    })
  } else {
    routines = await prisma.routine.findMany({})
  }
  return NextResponse.json(routines)
}

export async function POST(request: NextRequest) {
  const { routineId, logImg, reflection } = await request.json()

  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })
}
