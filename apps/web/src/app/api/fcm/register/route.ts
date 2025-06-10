import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/services/token.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token')

    if (!jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getUserIdFromToken({ token: jwt_token.value })
    const { token, deviceType = 'mobile', deviceInfo } = await request.json()

    if (!token) {
      return NextResponse.json({ message: 'FCM token is required' }, { status: 400 })
    }

    // 기존 토큰이 있는지 확인
    const existingToken = await prisma.fCMToken.findFirst({
      where: { token },
    })

    if (existingToken) {
      // 토큰이 이미 존재하면 업데이트 (사용자가 바뀔 수 있음)
      await prisma.fCMToken.update({
        where: { id: existingToken.id },
        data: {
          userId,
          lastUsed: new Date(),
          isActive: true,
          deviceType,
          deviceInfo,
        },
      })
    } else {
      // 새로운 토큰 생성
      await prisma.fCMToken.create({
        data: {
          userId,
          token,
          deviceType,
          deviceInfo,
          isActive: true,
        },
      })
    }

    return NextResponse.json({
      message: 'FCM token registered successfully',
      token: token.substring(0, 10) + '...', // 보안을 위해 일부만 반환
    })
  } catch (error) {
    console.error('Error registering FCM token:', error)
    return NextResponse.json({ message: 'Failed to register FCM token' }, { status: 500 })
  }
}

// 토큰 비활성화 (로그아웃 등)
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token')

    if (!jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getUserIdFromToken({ token: jwt_token.value })
    const { token } = await request.json()

    if (token) {
      // 특정 토큰 비활성화
      await prisma.fCMToken.updateMany({
        where: {
          userId,
          token,
        },
        data: { isActive: false },
      })
    } else {
      // 사용자의 모든 토큰 비활성화
      await prisma.fCMToken.updateMany({
        where: { userId },
        data: { isActive: false },
      })
    }

    return NextResponse.json({ message: 'FCM token deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating FCM token:', error)
    return NextResponse.json({ message: 'Failed to deactivate FCM token' }, { status: 500 })
  }
}
