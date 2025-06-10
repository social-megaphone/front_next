// apps/web/src/app/api/auth/initial/route.ts
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nickname, goalDate, routine, reflection, imgSrc, fcmToken } = body

  try {
    const user = await prisma.user.create({
      data: {
        nickname: nickname,
        profileImage: '/haru_user.png',
        fcmTokens: {
          create: {
            token: fcmToken || null,
          },
        },
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

    // JWT 토큰 생성
    const JWT_TOKEN = await jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET || '',
    )

    const cookieStore = await cookies()

    // 쿠키 설정
    cookieStore.set('jwt_token', JWT_TOKEN, {
      httpOnly: true,
      secure: process.env.MODE === 'dev' ? false : true,
      path: '/',
    })

    return NextResponse.json({
      message: 'success',
      JWT_TOKEN: JWT_TOKEN,
      nickname: user.nickname,
      profileImage: user.profileImage,
      userId: user.id,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 })
  }
}
