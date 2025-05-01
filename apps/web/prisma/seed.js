// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 먼저 기존 데이터 삭제 (관계 순서 고려)
  await prisma.notification.deleteMany({})
  await prisma.bookmark.deleteMany({})
  await prisma.like.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.routineLog.deleteMany({})
  await prisma.routine.deleteMany({})
  await prisma.tag.deleteMany({})

  console.log('All existing data deleted.')

  // 태그 생성
  console.log('Creating tags...')
  const tags = [
    { name: '생활습관', description: '일상 생활에서 형성할 수 있는 건강한 습관' },
    { name: '감정돌봄', description: '정서적 안정과 긍정적인 마음가짐을 위한 습관' },
    { name: '대인관계', description: '타인과의 관계를 개선하고 유지하는 습관' },
    { name: '작은 습관', description: '짧은 시간 내에 실천할 수 있는 작은 습관' },
    { name: '학습', description: '지식 습득과 성장을 위한 습관' },
    { name: '건강', description: '신체적 건강을 위한 습관' },
  ]

  for (const tag of tags) {
    // Tag 모델의 name이 unique가 아니므로 upsert 대신 create 사용
    const existingTag = await prisma.tag.findFirst({
      where: { name: tag.name },
    })

    if (!existingTag) {
      await prisma.tag.create({
        data: tag,
      })
      console.log(`Created tag: ${tag.name}`)
    } else {
      console.log(`Tag ${tag.name} already exists, skipping...`)
    }
  }

  // 유저 생성 또는 업데이트
  const existingUser = await prisma.user.findUnique({
    where: {
      id: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
    },
  })

  if (!existingUser) {
    console.log('Creating default user...')
    await prisma.user.create({
      data: {
        id: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
        nickname: '유쾌한 토끼',
        goal: '건강한 습관 만들기',
        goalDuration: 30,
        level: 1,
        streak: 0,
        profileImage: 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/default_profile.png',
      },
    })
  }

  // 추가 유저 생성
  const user2 = await prisma.user.upsert({
    where: { id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' },
    update: {},
    create: {
      id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      nickname: '따뜻한 고양이',
      goal: '일상에 활력주기',
      goalDuration: 21,
      level: 2,
      streak: 5,
      profileImage: 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/default_profile.png',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6' },
    update: {},
    create: {
      id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      nickname: '활발한 강아지',
      goal: '긍정적인 마음가짐',
      goalDuration: 14,
      level: 3,
      streak: 12,
      profileImage: 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/default_profile.png',
    },
  })

  // 루틴 생성
  const routines = [
    {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '내 공간 1개 정돈하기',
      desc: '깔끔하고 깨끗해진 내 공간을 만들어보세요.',
      isRecommended: true,
      tag: '생활습관',
      isActive: true,
    },
    {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '아침 물 한 잔 마시기',
      desc: '매일 아침 물 한 잔으로 하루를 상쾌하게 시작해요',
      isRecommended: true,
      tag: '생활습관',
      isActive: true,
    },
    {
      userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      title: '감사일기 쓰기',
      desc: '오늘 하루 감사했던 순간들을 되돌아보며 긍정적인 마음을 유지해요',
      isRecommended: true,
      tag: '감정돌봄',
      isActive: true,
    },
    {
      userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      title: '친구에게 안부 메시지 보내기',
      desc: '소중한 사람들과 연결감을 유지하는 작은 실천',
      isRecommended: true,
      tag: '대인관계',
      isActive: true,
    },
    {
      userId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      title: '5분 스트레칭하기',
      desc: '간단한 스트레칭으로 몸과 마음의 긴장을 풀어요',
      isRecommended: true,
      tag: '작은 습관',
      isActive: true,
    },
    {
      userId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      title: '명상 10분하기',
      desc: '마음의 안정을 찾고 집중력을 높이는 시간',
      isRecommended: true,
      tag: '감정돌봄',
      isActive: true,
    },
  ]

  console.log('Creating routines...')
  for (const routine of routines) {
    const existingRoutine = await prisma.routine.findFirst({
      where: {
        userId: routine.userId,
        title: routine.title,
      },
    })

    if (existingRoutine) {
      console.log(`Routine "${routine.title}" already exists, skipping...`)
      continue
    }

    const createdRoutine = await prisma.routine.create({
      data: routine,
    })
    console.log(`Created routine: ${createdRoutine.title}`)

    // 루틴 로그 생성 - 루틴마다 다른 소감과 이미지 추가
    let reflection = ''
    let logImg = null

    // 루틴별 맞춤 소감 설정
    if (routine.title === '내 공간 1개 정돈하기') {
      reflection = '책상을 정리했더니 마음도 정돈되는 느낌이에요. 작업 효율도 올라가는 것 같아요!'
      logImg = 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_computer.png'
    } else if (routine.title === '아침 물 한 잔 마시기') {
      reflection = '아침에 물을 마시니 몸이 깨어나는 느낌이에요. 하루를 활기차게 시작할 수 있었어요.'
      logImg = 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_water.png'
    } else if (routine.title === '감사일기 쓰기') {
      reflection = '오늘 있었던 소소한 일들에 감사하며 일기를 썼어요. 긍정적인 마음가짐이 생기는 것 같아요.'
      logImg = '/noImg.png'
    } else if (routine.title === '친구에게 안부 메시지 보내기') {
      reflection =
        '오랜만에 친구에게 연락했더니 너무 반가워하네요. 작은 실천이지만 소중한 관계를 유지할 수 있어 좋아요.'
      logImg = '/noImg.png'
    } else if (routine.title === '5분 스트레칭하기') {
      reflection = '짧은 스트레칭이었지만 굳어있던 몸이 풀리는 느낌이에요. 머리도 맑아지고 기분이 좋아졌어요!'
      logImg = '/noImg.png'
    } else if (routine.title === '명상 10분하기') {
      reflection = '10분 동안 마음을 비우고 명상에 집중했어요. 복잡했던 생각들이 정리되는 느낌이에요.'
      logImg = '/noImg.png'
    } else {
      reflection = `${routine.title} 루틴을 수행했어요. 꾸준히 하니 좋은 습관이 되고 있어요!`
    }

    const routineLog = await prisma.routineLog.create({
      data: {
        userId: routine.userId,
        routineId: createdRoutine.id,
        performedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        reflection: reflection,
        isPublic: true,
        logImg: logImg,
      },
    })

    // 유저 ID 배열
    const userIds = [
      '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
    ]
    const otherUserIds = userIds.filter((id) => id !== routine.userId)

    // 댓글 추가
    if (Math.random() > 0.5) {
      const commentUserId = otherUserIds[Math.floor(Math.random() * otherUserIds.length)]
      await prisma.comment.create({
        data: {
          logId: routineLog.id,
          userId: commentUserId,
          content: '정말 좋은 습관이네요! 저도 도전해볼게요 👍',
          isDeleted: false,
        },
      })

      // 댓글 알림 생성
      await prisma.notification.create({
        data: {
          userId: routine.userId,
          type: 'comment',
          content: `${commentUserId === 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' ? '따뜻한 고양이' : '활발한 강아지'}님이 회원님의 루틴 로그에 댓글을 남겼습니다.`,
          isRead: false,
        },
      })
    }

    // 좋아요 추가
    if (Math.random() > 0.4) {
      const likeUserId = otherUserIds[Math.floor(Math.random() * otherUserIds.length)]

      await prisma.like.create({
        data: {
          userId: likeUserId,
          routineLogId: routineLog.id,
        },
      })

      // 좋아요 알림 생성
      await prisma.notification.create({
        data: {
          userId: routine.userId,
          type: 'like',
          content: `${likeUserId === 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' ? '따뜻한 고양이' : '활발한 강아지'}님이 회원님의 루틴 로그를 좋아합니다.`,
          isRead: false,
        },
      })
    }

    // 북마크 추가
    if (Math.random() > 0.7) {
      const bookmarkUserId = otherUserIds[Math.floor(Math.random() * otherUserIds.length)]

      await prisma.bookmark.create({
        data: {
          userId: bookmarkUserId,
          routineLogId: routineLog.id,
        },
      })
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
