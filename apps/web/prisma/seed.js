// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default user if not exists
  // Delete data in the correct order to avoid foreign key constraint violations
  await prisma.like.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.routineLog.deleteMany({})
  await prisma.routine.deleteMany({})

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

  // Create more users
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

  // Create routines
  const routines = [
    {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '내 공간 1개 정돈하기',
      desc: '깔끔하고 깨끗해진 내 책상을 보니 뿌듯해요. 다음에는 내 방 청소에 도전해볼게요!',
      thumbnailImg: 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_computer.png',
      isRecommended: true,
      tag: '생활습관',
    },
    {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '아침 물 한 잔 마시기',
      desc: '매일 아침 물 한 잔으로 하루를 상쾌하게 시작해요',
      thumbnailImg: 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_water.png',
      isRecommended: true,
      tag: '생활습관',
    },
    {
      userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      title: '감사일기 쓰기',
      desc: '오늘 하루 감사했던 순간들을 되돌아보며 긍정적인 마음을 유지해요',
      thumbnailImg: '/noImg.png',
      isRecommended: true,
      tag: '감정돌봄',
    },
    {
      userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      title: '친구에게 안부 메시지 보내기',
      desc: '소중한 사람들과 연결감을 유지하는 작은 실천',
      thumbnailImg: '/noImg.png',
      isRecommended: false,
      tag: '대인관계',
    },
    {
      userId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      title: '5분 스트레칭하기',
      desc: '간단한 스트레칭으로 몸과 마음의 긴장을 풀어요',
      thumbnailImg: '/noImg.png',
      isRecommended: true,
      tag: '작은 습관',
    },
    {
      userId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      title: '명상 10분하기',
      desc: '마음의 안정을 찾고 집중력을 높이는 시간',
      thumbnailImg: '/noImg.png',
      isRecommended: true,
      tag: '감정돌봄',
    },
  ]

  console.log('Creating routines...')
  for (const routine of routines) {
    // Check if routine already exists to avoid duplicates
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

    // Create routine logs for each routine (only one per routine to avoid duplicates)
    const routineLog = await prisma.routineLog.create({
      data: {
        userId: routine.userId,
        routineId: createdRoutine.id,
        performedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        reflection: `${routine.title} 루틴을 수행했어요. 꾸준히 하니 좋은 습관이 되고 있어요!`,
        tag: routine.tag,
      },
    })

    // Add comments to routine logs
    const userIds = [
      '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
    ]
    const otherUserIds = userIds.filter((id) => id !== routine.userId)

    if (Math.random() > 0.5) {
      await prisma.comment.create({
        data: {
          logId: routineLog.id,
          userId: otherUserIds[Math.floor(Math.random() * otherUserIds.length)],
          content: '정말 좋은 습관이네요! 저도 도전해볼게요 👍',
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
