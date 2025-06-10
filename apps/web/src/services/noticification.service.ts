// apps/web/src/services/notification.service.ts
import { sendFCMNotification, sendFCMNotificationToMultiple } from '@/lib/firebase-admin'
import prisma from '@/lib/prisma'

/**
 * 좋아요 알림 전송
 */
export const sendLikeNotification = async ({
  targetUserId,
  likerNickname,
  routineTitle,
}: {
  targetUserId: string
  likerNickname: string
  routineTitle: string
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { fcmToken: true },
    })

    if (user?.fcmToken) {
      await sendFCMNotification({
        token: user.fcmToken,
        title: '새로운 좋아요!',
        body: `${likerNickname}님이 "${routineTitle}" 루틴을 좋아합니다.`,
        data: {
          type: 'like',
          targetUserId,
          routineTitle,
        },
      })
    }
  } catch (error) {
    console.error('Error sending like notification:', error)
  }
}

/**
 * 댓글 알림 전송
 */
export const sendCommentNotification = async ({
  targetUserId,
  commenterNickname,
  routineTitle,
  comment,
}: {
  targetUserId: string
  commenterNickname: string
  routineTitle: string
  comment: string
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { fcmToken: true },
    })

    if (user?.fcmToken) {
      await sendFCMNotification({
        token: user.fcmToken,
        title: '새로운 댓글!',
        body: `${commenterNickname}님이 댓글을 남겼습니다: "${comment.substring(0, 30)}${comment.length > 30 ? '...' : ''}"`,
        data: {
          type: 'comment',
          targetUserId,
          routineTitle,
          comment,
        },
      })
    }
  } catch (error) {
    console.error('Error sending comment notification:', error)
  }
}

/**
 * 루틴 리마인더 알림 전송
 */
export const sendRoutineReminder = async ({ userId, routineTitle }: { userId: string; routineTitle: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true, nickname: true },
    })

    if (user?.fcmToken) {
      await sendFCMNotification({
        token: user.fcmToken,
        title: '루틴 시간이에요!',
        body: `"${routineTitle}" 루틴을 실행할 시간입니다. 오늘도 좋은 습관을 만들어보세요!`,
        data: {
          type: 'routine_reminder',
          userId,
          routineTitle,
        },
      })
    }
  } catch (error) {
    console.error('Error sending routine reminder:', error)
  }
}

/**
 * 전체 사용자에게 공지사항 전송
 */
export const sendBroadcastNotification = async ({
  title,
  body,
  data = {},
}: {
  title: string
  body: string
  data?: Record<string, string>
}) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        fcmToken: {
          not: null,
        },
      },
      select: { fcmToken: true },
    })

    const tokens = users.map((user) => user.fcmToken).filter((token): token is string => token !== null)

    if (tokens.length > 0) {
      // FCM은 한 번에 최대 500개의 토큰만 처리 가능
      const chunks = []
      for (let i = 0; i < tokens.length; i += 500) {
        chunks.push(tokens.slice(i, i + 500))
      }

      for (const chunk of chunks) {
        await sendFCMNotificationToMultiple({
          tokens: chunk,
          title,
          body,
          data: {
            ...data,
            type: 'broadcast',
          },
        })
      }
    }
  } catch (error) {
    console.error('Error sending broadcast notification:', error)
  }
}
