import prisma from '@/lib/prisma'
import { sendNotificationToDevice, sendNotificationToMultipleDevices } from '@/lib/firebase-admin'

export interface NotificationPayload {
  userId?: string
  userIds?: string[]
  type: 'like' | 'comment' | 'streak' | 'achievement' | 'routine_reminder' | 'system'
  title: string
  content: string
  data?: Record<string, any>
  actionUrl?: string
  routineLogId?: string
  commentId?: string
  senderId?: string
  saveToDatabase?: boolean
}

// 알림 생성 및 FCM 전송 (통합 함수)
export const createAndSendNotification = async (payload: NotificationPayload) => {
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
    senderId,
    saveToDatabase = true,
  } = payload

  try {
    const results = []

    // 단일 사용자
    if (userId) {
      const result = await sendNotificationToUser({
        userId,
        type,
        title,
        content,
        data,
        actionUrl,
        routineLogId,
        commentId,
        senderId,
        saveToDatabase,
      })
      results.push(result)
    }

    // 여러 사용자
    if (userIds && userIds.length > 0) {
      const result = await sendNotificationToUsers({
        userIds,
        type,
        title,
        content,
        data,
        actionUrl,
        routineLogId,
        commentId,
        senderId,
        saveToDatabase,
      })
      results.push(result)
    }

    return results
  } catch (error) {
    console.error('Error in createAndSendNotification:', error)
    throw error
  }
}

// 단일 사용자에게 알림 전송
const sendNotificationToUser = async (params: {
  userId: string
  type: string
  title: string
  content: string
  data?: Record<string, any>
  actionUrl?: string
  routineLogId?: string
  commentId?: string
  senderId?: string
  saveToDatabase?: boolean
}) => {
  const {
    userId,
    type,
    title,
    content,
    data = {},
    actionUrl,
    routineLogId,
    commentId,
    senderId,
    saveToDatabase = true,
  } = params

  // FCM 토큰 조회
  const fcmTokens = await prisma.fCMToken.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: { id: true, token: true },
  })

  let successCount = 0
  let failedTokens: string[] = []

  // FCM 전송
  if (fcmTokens.length > 0) {
    const fcmData = {
      type,
      userId,
      ...(senderId && { senderId }),
      ...(actionUrl && { actionUrl }),
      ...(routineLogId && { routineLogId }),
      ...(commentId && { commentId }),
      ...data,
    }

    for (const { id: tokenId, token } of fcmTokens) {
      try {
        const result = await sendNotificationToDevice(token, title, content, fcmData)

        if (result.success) {
          successCount++
          // 토큰 마지막 사용 시간 업데이트
          await prisma.fCMToken.update({
            where: { id: tokenId },
            data: { lastUsed: new Date() },
          })
        } else if (result.error === 'INVALID_TOKEN') {
          // 유효하지 않은 토큰 비활성화
          await prisma.fCMToken.update({
            where: { id: tokenId },
            data: { isActive: false },
          })
          failedTokens.push(token)
        }
      } catch (error) {
        console.error(`Error sending to token ${token}:`, error)
        failedTokens.push(token)
      }
    }
  }

  // 데이터베이스에 알림 저장
  let notification = null
  if (saveToDatabase) {
    notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        data: data as any,
        actionUrl,
        routineLogId,
        commentId,
        senderId,
        isSent: successCount > 0,
        sentAt: successCount > 0 ? new Date() : null,
        failReason: successCount === 0 && fcmTokens.length > 0 ? 'All tokens failed' : null,
        isRead: false,
      },
    })
  }

  return {
    userId,
    successCount,
    totalTokens: fcmTokens.length,
    failedTokens,
    notification,
  }
}

// 여러 사용자에게 알림 전송
const sendNotificationToUsers = async (params: {
  userIds: string[]
  type: string
  title: string
  content: string
  data?: Record<string, any>
  actionUrl?: string
  routineLogId?: string
  commentId?: string
  senderId?: string
  saveToDatabase?: boolean
}) => {
  const {
    userIds,
    type,
    title,
    content,
    data = {},
    actionUrl,
    routineLogId,
    commentId,
    senderId,
    saveToDatabase = true,
  } = params

  // 모든 사용자의 FCM 토큰 조회
  const fcmTokens = await prisma.fCMToken.findMany({
    where: {
      userId: { in: userIds },
      isActive: true,
    },
    select: { token: true, userId: true },
  })

  let successCount = 0
  let failedTokens: string[] = []

  // FCM 멀티캐스트 전송
  if (fcmTokens.length > 0) {
    const fcmData = {
      type,
      ...(senderId && { senderId }),
      ...(actionUrl && { actionUrl }),
      ...(routineLogId && { routineLogId }),
      ...(commentId && { commentId }),
      ...data,
    }

    const tokenStrings = fcmTokens.map((t) => t.token)
    const response = await sendNotificationToMultipleDevices(tokenStrings, title, content, fcmData)

    successCount = response.successCount
    failedTokens = response.failedTokens || []

    // 실패한 토큰들 비활성화
    if (failedTokens.length > 0) {
      await prisma.fCMToken.updateMany({
        where: {
          token: { in: failedTokens },
        },
        data: { isActive: false },
      })
    }

    // 성공한 토큰들의 마지막 사용 시간 업데이트
    const successTokens = fcmTokens.filter((t) => !failedTokens.includes(t.token)).map((t) => t.token)

    if (successTokens.length > 0) {
      await prisma.fCMToken.updateMany({
        where: {
          token: { in: successTokens },
        },
        data: { lastUsed: new Date() },
      })
    }
  }

  // 데이터베이스에 알림 저장
  let notifications = null
  if (saveToDatabase) {
    const notificationData = userIds.map((userId) => ({
      userId,
      type,
      title,
      content,
      data: data as any,
      actionUrl,
      routineLogId,
      commentId,
      senderId,
      isSent: successCount > 0,
      sentAt: successCount > 0 ? new Date() : null,
      isRead: false,
    }))

    await prisma.notification.createMany({
      data: notificationData,
    })

    // FCM 로그 저장 (선택적)
    await prisma.fCMLog.create({
      data: {
        tokens: fcmTokens.map((t) => t.token),
        title,
        body: content,
        data: data as any,
        successCount,
        failureCount: failedTokens.length,
        failedTokens,
        type,
      },
    })
  }

  return {
    userIds,
    successCount,
    totalTokens: fcmTokens.length,
    failedTokens,
    notifications,
  }
}

// 특정 타입별 알림 전송 헬퍼 함수들

// 좋아요 알림
export const sendLikeNotification = async (routineLogId: string, routineOwnerId: string, likerUserId: string) => {
  try {
    // 자신의 게시물에 좋아요를 누른 경우 알림 전송 안함
    if (routineOwnerId === likerUserId) {
      return null
    }

    // 필요한 정보 조회
    const [routineLog, liker] = await Promise.all([
      prisma.routineLog.findUnique({
        where: { id: routineLogId },
        include: {
          routine: { select: { title: true } },
          user: { select: { nickname: true } },
        },
      }),
      prisma.user.findUnique({
        where: { id: likerUserId },
        select: { nickname: true },
      }),
    ])

    if (!routineLog || !liker) {
      throw new Error('Required data not found')
    }

    return await createAndSendNotification({
      userId: routineOwnerId,
      type: 'like',
      title: '새로운 좋아요',
      content: `${liker.nickname}님이 "${routineLog.routine.title}" 루틴에 좋아요를 눌렀습니다.`,
      data: {
        likerNickname: liker.nickname,
        routineTitle: routineLog.routine.title,
      },
      actionUrl: `/routine/${routineLogId}`,
      routineLogId,
      senderId: likerUserId,
    })
  } catch (error) {
    console.error('Error sending like notification:', error)
    throw error
  }
}

// 댓글 알림
export const sendCommentNotification = async (
  routineLogId: string,
  routineOwnerId: string,
  commenterUserId: string,
  commentId: string,
) => {
  try {
    // 자신의 게시물에 댓글을 단 경우 알림 전송 안함
    if (routineOwnerId === commenterUserId) {
      return null
    }

    // 필요한 정보 조회
    const [routineLog, commenter] = await Promise.all([
      prisma.routineLog.findUnique({
        where: { id: routineLogId },
        include: {
          routine: { select: { title: true } },
          user: { select: { nickname: true } },
        },
      }),
      prisma.user.findUnique({
        where: { id: commenterUserId },
        select: { nickname: true },
      }),
    ])

    if (!routineLog || !commenter) {
      throw new Error('Required data not found')
    }

    return await createAndSendNotification({
      userId: routineOwnerId,
      type: 'comment',
      title: '새로운 댓글',
      content: `${commenter.nickname}님이 "${routineLog.routine.title}" 루틴에 댓글을 남겼습니다.`,
      data: {
        commenterNickname: commenter.nickname,
        routineTitle: routineLog.routine.title,
      },
      actionUrl: `/routine/${routineLogId}`,
      routineLogId,
      commentId,
      senderId: commenterUserId,
    })
  } catch (error) {
    console.error('Error sending comment notification:', error)
    throw error
  }
}

// 연속 달성 알림
export const sendStreakNotification = async (userId: string, streakCount: number) => {
  try {
    return await createAndSendNotification({
      userId,
      type: 'streak',
      title: '연속 달성 축하!',
      content: `${streakCount}일 연속 루틴을 달성했습니다! 🔥`,
      data: {
        streakCount: streakCount.toString(),
      },
      actionUrl: '/mypage',
    })
  } catch (error) {
    console.error('Error sending streak notification:', error)
    throw error
  }
}

// 루틴 리마인더 알림
export const sendRoutineReminderNotification = async (userId: string, routineTitle: string, routineId?: string) => {
  try {
    return await createAndSendNotification({
      userId,
      type: 'routine_reminder',
      title: '루틴 리마인더',
      content: `"${routineTitle}" 루틴을 실천할 시간입니다! ⏰`,
      data: {
        routineTitle,
        ...(routineId && { routineId }),
      },
      actionUrl: '/home',
    })
  } catch (error) {
    console.error('Error sending routine reminder notification:', error)
    throw error
  }
}

// 배지/성취 알림
export const sendAchievementNotification = async (userId: string, achievementName: string, achievementId?: string) => {
  try {
    return await createAndSendNotification({
      userId,
      type: 'achievement',
      title: '새로운 배지 획득!',
      content: `"${achievementName}" 배지를 획득했습니다! 🏆`,
      data: {
        achievementName,
        ...(achievementId && { achievementId }),
      },
      actionUrl: '/badge',
    })
  } catch (error) {
    console.error('Error sending achievement notification:', error)
    throw error
  }
}

// 시스템 알림 (공지사항 등)
export const sendSystemNotification = async (userIds: string[], title: string, content: string, actionUrl?: string) => {
  try {
    return await createAndSendNotification({
      userIds,
      type: 'system',
      title,
      content,
      actionUrl,
    })
  } catch (error) {
    console.error('Error sending system notification:', error)
    throw error
  }
}

// 알림 통계 조회
export const getNotificationStats = async (userId?: string) => {
  try {
    const where = userId ? { userId } : {}

    const [totalNotifications, unreadNotifications, notificationsByType, recentFailedTokens] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { ...where, isRead: false },
      }),
      prisma.notification.groupBy({
        by: ['type'],
        where,
        _count: { id: true },
      }),
      prisma.fCMToken.count({
        where: { isActive: false },
      }),
    ])

    return {
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      recentFailedTokens,
    }
  } catch (error) {
    console.error('Error getting notification stats:', error)
    throw error
  }
}

// 만료된/비활성 토큰 정리 (배치 작업용)
export const cleanupInactiveTokens = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.fCMToken.deleteMany({
      where: {
        OR: [
          { isActive: false },
          {
            lastUsed: { lt: cutoffDate },
            isActive: true,
          },
        ],
      },
    })

    console.log(`Cleaned up ${result.count} inactive FCM tokens`)
    return result.count
  } catch (error) {
    console.error('Error cleaning up inactive tokens:', error)
    throw error
  }
}
