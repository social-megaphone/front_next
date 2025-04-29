import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromToken } from '@/services/token.service'
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token')

  const { title, desc, tag, imgSrc } = await request.json()

  if (!jwt_token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const id = await getUserIdFromToken({ token: jwt_token.value })

  const routine = await prisma.routine.create({
    data: {
      title,
      desc,
      tag: tag,
      user: {
        connect: {
          id: id,
        },
      },
    },
  })
}
