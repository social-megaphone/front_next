import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { goalDuration, goal, nickname, profileImage } = body

  const user = await prisma.user.create({
    data: {
      nickname: nickname,
      profileImage: profileImage || '/default-user.avif',
      goalDuration: goalDuration || 30,
      goal: goal || '취업',
    },
  })

  // 아이디만 넣자~
  const JWT_TOKEN = await jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET || '',
  )

  const cookieStore = await cookies()

  // 지금은 그냥 넣는거니까 expire 없이.
  cookieStore.set('jwt_token', JWT_TOKEN, {
    httpOnly: true,
    secure: process.env.MODE === 'dev' ? false : true,
    path: '/',
  })

  // 어디까지 반환해주는게 맞을까? goal이나 그런건 딱히 필요없을거 같기도 하고
  return NextResponse.json({ message: 'success', nickname: user.nickname, profileImage: user.profileImage })
}
