import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/services/token.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt_token = cookieStore.get('jwt_token') || { value: request.headers.get('Authorization')?.split(' ')[1] }

  if (!jwt_token || !jwt_token.value) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getUserIdFromToken({ token: jwt_token.value })

  const myProfile = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })
  console.log(myProfile)

  return NextResponse.json({ data: myProfile })
}
