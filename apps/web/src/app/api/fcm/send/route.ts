import { sendFCMNotification, sendFCMNotificationToMultiple } from '@/lib/firebase-admin'
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

    const senderId = await getUserIdFromToken({ token: jwt_token.value })
    const {
      recipientId,
      recipientIds,
      title,
      body,
      data,
      type = 'general',
      saveToDatabase = true,
    } = await request.json()

    if (!title || !body) {
      return NextResponse.json({ message: 'Title and body are required' }, { status: 400 })
    }

    let results = []
    let failedTokens: string[] = []

    // 단일 사용자에게 전송
    if (recipientId) {
      const tokens = await prisma.fCMToken.findMany({
        where: {
          userId: recipientId,
          isActive: true,
        },
        select: { id: true, token: true },
      })

      if (tokens.length === 0) {
        return NextResponse.json({ message: 'No active FCM tokens found for user' }, { status: 404 })
      }

      // 각 토큰에 개별적으로 전송
      for (const { id: tokenId, token } of tokens) {
        try {
          const result = await sendFCMNotification({
            token,
            title,
            body,
            ...data,
            senderId,
            type,
            recipientId,
          })

          if (result) {
            // 토큰 마지막 사용 시간 업데이트
            await prisma.fCMToken.update({
              where: { id: tokenId },
              data: { lastUsed: new Date() },
            })
          } else {
            // 유효하지 않은 토큰 비활성화
            await prisma.fCMToken.update({
              where: { id: tokenId },
              data: { isActive: false },
            })
            failedTokens.push(token)
          }

          results.push(result)
        } catch (error) {
          console.error(`Error sending to token ${token}:`, error)
          failedTokens.push(token)
        }
      }

      // // const successCount = results.filter((r) => r.success).length

      // // 데이터베이스에 알림 저장 (옵션)
      // if (saveToDatabase) {
      //   await prisma.notification.create({
      //     data: {
      //       userId: recipientId,
      //       type,
      //       title,
      //       content: body,
      //       senderId,
      //       data: data || {},
      //       isSent: successCount > 0,
      //       sentAt: successCount > 0 ? new Date() : null,
      //       failReason: successCount === 0 ? 'All tokens failed' : null,
      //       isRead: false,
      //     },
      //   })
      // }

      return NextResponse.json({
        message: `Notification sent to ${tokens.length} devices`,
        // successCount,
        totalCount: tokens.length,
        failedTokens: failedTokens.length > 0 ? failedTokens : undefined,
      })
    }

    // 여러 사용자에게 전송
    if (recipientIds && Array.isArray(recipientIds)) {
      const tokens = await prisma.fCMToken.findMany({
        where: {
          userId: { in: recipientIds },
          isActive: true,
        },
        select: { token: true, userId: true },
      })

      if (tokens.length === 0) {
        return NextResponse.json({ message: 'No active FCM tokens found' }, { status: 404 })
      }

      const tokenStrings = tokens.map((t) => t.token)
      const response = await sendFCMNotificationToMultiple({
        tokens: tokenStrings,
        title,
        body,
        data: { ...data, senderId, type },
      })

      // // 실패한 토큰들 비활성화
      // if (response.errors && response.errors.length > 0) {
      //   await prisma.fCMToken.updateMany({
      //     where: {
      //       token: { in: response.errors },
      //     },
      //     data: { isActive: false },
      //   })
      // }

      // 각 사용자별로 알림 저장
      if (saveToDatabase) {
        const notifications = recipientIds.map((userId) => ({
          userId,
          type,
          title,
          content: body,
          senderId,
          data: data || {},
          isSent: true,
          sentAt: new Date(),
          isRead: false,
        }))

        await prisma.notification.createMany({
          data: notifications,
        })
      }

      return NextResponse.json({
        message: 'Notifications sent successfully',
        successCount: response.successCount,
        failureCount: response.failureCount,
      })
    }

    return NextResponse.json({ message: 'recipientId or recipientIds is required' }, { status: 400 })
  } catch (error) {
    console.error('Error sending FCM notification:', error)
    return NextResponse.json({ message: 'Failed to send notification' }, { status: 500 })
  }
}
