import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/services/token.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createAndSendNotification, getNotificationStats } from '@/utils/notificationService'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token')

    if (!jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const senderId = await getUserIdFromToken({ token: jwt_token.value })
    const {
      userId,
      userIds,
      type,
      title,
      content,
      data = {},
      actionUrl,
      routineLogId,
      commentId,
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 })
    }

    if (!userId && (!userIds || userIds.length === 0)) {
      return NextResponse.json({ message: 'userId or userIds is required' }, { status: 400 })
    }

    const results = await createAndSendNotification({
      userId,
      userIds,
      type,
      title,
      content,
      data,
      actionUrl,
      routineLogId,
      commentId,
      senderId,
    })

    return NextResponse.json({
      message: 'Notification sent successfully',
      results,
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ message: 'Failed to send notification' }, { status: 500 })
  }
}

// 사용자의 알림 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const stats = searchParams.get('stats') === 'true'

    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token')

    if (!jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getUserIdFromToken({ token: jwt_token.value })

    // 통계만 요청한 경우
    if (stats) {
      const notificationStats = await getNotificationStats(userId)
      return NextResponse.json(notificationStats)
    }

    // 알림 목록 조회
    const where: any = { userId }
    if (type) where.type = type
    if (unreadOnly) where.isRead = false

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// 알림 읽음 처리
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token')

    if (!jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getUserIdFromToken({ token: jwt_token.value })
    const { notificationId, notificationIds, markAllAsRead } = await request.json()

    if (markAllAsRead) {
      // 모든 알림을 읽음으로 처리
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: { isRead: true },
      })

      return NextResponse.json({
        message: `${result.count} notifications marked as read`,
      })
    }

    if (notificationIds && Array.isArray(notificationIds)) {
      // 여러 알림을 읽음으로 처리
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId,
        },
        data: { isRead: true },
      })

      return NextResponse.json({
        message: `${result.count} notifications marked as read`,
      })
    }

    if (notificationId) {
      // 특정 알림을 읽음으로 처리
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId,
        },
        data: { isRead: true },
      })

      return NextResponse.json({ message: 'Notification marked as read' })
    }

    return NextResponse.json({ message: 'No valid parameters provided' }, { status: 400 })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ message: 'Failed to update notification' }, { status: 500 })
  }
}

// 알림 삭제
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token')

    if (!jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getUserIdFromToken({ token: jwt_token.value })
    const { notificationId, olderThan } = await request.json()

    if (notificationId) {
      // 특정 알림 삭제
      await prisma.notification.delete({
        where: {
          id: notificationId,
          userId,
        },
      })

      return NextResponse.json({ message: 'Notification deleted' })
    }

    if (olderThan) {
      // 특정 날짜보다 오래된 알림들 삭제
      const cutoffDate = new Date(olderThan)
      const result = await prisma.notification.deleteMany({
        where: {
          userId,
          createdAt: { lt: cutoffDate },
        },
      })

      return NextResponse.json({
        message: `${result.count} old notifications deleted`,
      })
    }

    return NextResponse.json({ message: 'No valid parameters provided' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ message: 'Failed to delete notification' }, { status: 500 })
  }
}
