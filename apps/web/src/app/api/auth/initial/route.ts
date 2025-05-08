import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  // 처음엔 전부 받은 다음에 로그에 저장 + 사용자 등록을 동시에 해야할듯?
  const body = await request.json()
  const { nickname, goalDate, routine, reflection, imgSrc } = body

  const user = await prisma.user.create({
    data: {
      nickname: nickname,
      profileImage: '/haru_user.png',
      routines: {
        connect: {
          id: routine.id,
        },
      },
    },
  })

  // 루틴 로그 생성
  await prisma.routineLog.create({
    data: {
      routineId: routine.id,
      userId: user.id,
      logImg: imgSrc,
      reflection: reflection,
      performedAt: new Date(),
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
  return NextResponse.json({
    message: 'success',
    JWT_TOKEN: JWT_TOKEN,
    nickname: user.nickname,
    profileImage: user.profileImage,
  })
}
