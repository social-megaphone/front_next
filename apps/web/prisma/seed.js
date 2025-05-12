import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 먼저 기존 데이터 삭제 (관계 순서 고려)
  await prisma.notification.deleteMany({})
  await prisma.bookmark.deleteMany({})
  await prisma.like.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.routineLog.deleteMany({})
  await prisma.userRoutine.deleteMany({}) 
  await prisma.routine.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('All existing data deleted.')

  // 유저 생성 또는 업데이트
  console.log('Creating default user...')
  await prisma.user.create({
    data: {
      id: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      nickname: '유쾌한 토끼',
      level: 1,
      streak: 0,
      profileImage: '/haru_user.png',
    },
  })

  // 추가 유저 생성
  const user2 = await prisma.user.upsert({
    where: { id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' },
    update: {},
    create: {
      id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      nickname: '따뜻한 고양이',
      level: 2,
      streak: 5,
      profileImage: '/haru_user.png',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6' },
    update: {},
    create: {
      id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      nickname: '활발한 강아지',
      level: 3,
      streak: 12,
      profileImage: '/haru_user.png',
    },
  })

  // 추가 유저 생성 (MongoDB에서 가져온 루틴용)
  const user4 = await prisma.user.upsert({
    where: { id: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6' },
    update: {},
    create: {
      id: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      nickname: '신중한 거북이',
      level: 4,
      streak: 20,
      profileImage: '/haru_user.png',
    },
  })

  // 기존 루틴들
  const routines = [
    {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '내 공간 1개 정돈하기',
      desc: '깔끔하고 깨끗해진 내 공간을 만들어보세요.',
      how: '깔끔하게 정돈한 사진을 찍고, 공유해요.',
      color: 'yellow',
      icon: '🏠',
      isRecommended: true,
      tag: ['생활습관'],
      isActive: true,
    },
    {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '아침 물 한 잔 마시기',
      icon: '💧',
      desc: '매일 아침 물 한 잔으로 하루를 상쾌하게 시작해요',
      how: '물을 마신 컵 또는 잔의 사진을 찍고, 상쾌한 기분에 대한 한 줄 소감을 적어요.',
      color: 'blue',
      isRecommended: true,
      tag: ['생활습관'],
      isActive: true,
    },
    {
      userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      title: '감사일기 쓰기',
      icon: '📝',
      desc: '오늘 하루 감사했던 순간들을 되돌아보며 긍정적인 마음을 유지해요',
      how: '감사일기를 쓰고, 감사일기의 사진을 찍어 공유해요.',
      color: 'yellow',
      isRecommended: true,
      tag: ['감정돌봄'],
      isActive: true,
    },
    {
      userId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      title: '친구에게 안부 메시지 보내기',
      desc: '소중한 사람들과 연결감을 유지하는 작은 실천',
      how: '친구에게 안부 메시지를 보내고, 메시지의 사진을 찍어 공유해요.',
      color: 'blue',
      isRecommended: true,
      icon: '💌',
      tag: ['대인관계'],
      isActive: true,
    },
    {
      userId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      title: '5분 스트레칭하기',
      icon: '🧘',
      desc: '간단한 스트레칭으로 몸과 마음의 긴장을 풀어요',
      how: '5분 스트레칭을 하고, 스트레칭한 몸의 사진을 찍어 공유해요.',
      color: 'gray',
      isRecommended: true,
      tag: ['작은 습관'],
      isActive: true,
    },
    {
      userId: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      title: '명상 10분하기',
      desc: '마음의 안정을 찾고 집중력을 높이는 시간',
      how: '명상을 10분 하고, 명상한 사진을 찍어 공유해요.',
      color: 'green',
      icon: '🧘‍♀️',
      isRecommended: true,
      tag: ['감정돌봄'],
      isActive: true,
    },
    // MongoDB에서 가져온 새로운 루틴들
    {
      userId: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      title: '아침 물 한잔 마시기',
      desc: '매일 일어나자마자 물 한잔을 마시며 상쾌한 아침을 시작해요.',
      how: '아침에 물을 마신 컵 또는 잔의 사진을 찍고, 실천해본 한 줄 소감을 적어요.',
      icon: '💧',
      color: 'DDECFE',
      isRecommended: true,
      tag: ['생활리듬', '건강/운동'],
      isActive: true,
    },
    {
      userId: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      title: '5분 스트레칭 하기',
      desc: '아침 기상 후 자리에서 할 수 있는 간단한 목, 어깨 스트레칭을 5분 간 해봐요.',
      how: '스트레칭을 한 공간이나 모습을 사진으로 남기고, 스트레칭 후 느낀 기분을 한 줄로 기록해요.',
      icon: '🤸',
      color: 'DDECFE',
      isRecommended: true,
      tag: ['생활리듬', '건강/운동'],
      isActive: true,
    },
    {
      userId: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      title: '기상 또는 취침 시간 지키기',
      desc: '비슷한 시간에 일어나고 잠들어봐요. 하루의 흐름을 건강하게 만드는 작은 약속이에요. (±30분 이내)',
      how: '기상 시간과 취침 시간이 보이도록 사진을 찍고, 실천한 소감을 간단히 남겨요.',
      icon: '⏰',
      color: 'DDECFE',
      isRecommended: true,
      tag: ['생활리듬', '건강/운동'],
      isActive: true,
    },
    {
      userId: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      title: '나를 위한 건강식 한 끼',
      desc: '나를 위해 정성껏 준비한 건강한 한 끼를 먹고 기록해요.',
      how: '건강한 한 끼 식단 사진을 남기고, 식사를 마친 후 느낀 마음을 소감으로 적어요.',
      icon: '🥗',
      color: 'DDECFE',
      isRecommended: true,
      tag: ['생활리듬', '건강/운동'],
      isActive: true,
    },
    {
      userId: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      title: '내 공간 1개 정돈하기',
      desc: '하루에 하나, 침대나 책상 등 내 공간 중 한 곳을 정리해봐요. 공간이 정리되면 마음도 정리돼요.',
      how: '정리한 공간, 물건의 전후 비교 사진 또는 정리 후 결과 사진을 찍고, 소감을 적어요.',
      icon: '🧹',
      color: 'DDECFE',
      isRecommended: true,
      tag: ['생활리듬'],
      isActive: true,
    },
    {
      userId: 'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
      title: '바람 따라 걷기 20분',
      desc: '바쁜 하루 중 잠시 멈추고, 주변을 둘러보며 산책해요. 몸도 마음도 한결 가벼워져요.',
      how: '산책 중 찍은 거리, 나무, 하늘 등의 사진과 만보기 사진을 함께 남기고, 산책에 대한 소감을 남겨요.',
      icon: '🚶',
      color: 'DDECFE',
      isRecommended: true,
      tag: ['생활리듬', '건강/운동', '일상관찰'],
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

    // Add UserRoutine records (new addition)
    await prisma.userRoutine.create({
      data: {
        userId: routine.userId,
        routineId: createdRoutine.id,
        duration: routine.title.includes('명상') ? 10 : 5, // 명상 루틴은 10분, 나머지는 5분으로 설정
        isActive: true,
      },
    })

    // 루틴 로그 생성 - 루틴마다 다른 소감과 이미지 추가
    let reflection = ''
    let logImages = []

    // 루틴별 맞춤 소감 설정
    if (routine.title === '내 공간 1개 정돈하기') {
      reflection = '책상을 정리했더니 마음도 정돈되는 느낌이에요. 작업 효율도 올라가는 것 같아요!'
      logImages = 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_computer.png'
    } else if (routine.title === '아침 물 한 잔 마시기' || routine.title === '아침 물 한잔 마시기') {
      reflection = '아침에 물을 마시니 몸이 깨어나는 느낌이에요. 하루를 활기차게 시작할 수 있었어요.'
      logImages = 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_water.png'
    } else if (routine.title === '감사일기 쓰기') {
      reflection = '오늘 있었던 소소한 일들에 감사하며 일기를 썼어요. 긍정적인 마음가짐이 생기는 것 같아요.'
      logImages = '/noImg.png'
    } else if (routine.title === '친구에게 안부 메시지 보내기') {
      reflection =
        '오랜만에 친구에게 연락했더니 너무 반가워하네요. 작은 실천이지만 소중한 관계를 유지할 수 있어 좋아요.'
      logImages = '/noImg.png'
    } else if (routine.title === '5분 스트레칭하기' || routine.title === '5분 스트레칭 하기') {
      reflection = '짧은 스트레칭이었지만 굳어있던 몸이 풀리는 느낌이에요. 머리도 맑아지고 기분이 좋아졌어요!'
      logImages = '/noImg.png'
    } else if (routine.title === '명상 10분하기') {
      reflection = '10분 동안 마음을 비우고 명상에 집중했어요. 복잡했던 생각들이 정리되는 느낌이에요.'
      logImages = '/noImg.png'
    } else if (routine.title === '기상 또는 취침 시간 지키기') {
      reflection = '규칙적인 수면 패턴을 유지하니 하루가 더 활기차게 시작되어요!'
      logImages = '/noImg.png'
    } else if (routine.title === '나를 위한 건강식 한 끼') {
      reflection = '건강한 재료로 만든 음식을 먹으니 몸도 마음도 가벼워진 기분이에요.'
      logImages = '/noImg.png'
    } else if (routine.title === '바람 따라 걷기 20분') {
      reflection = '산책하며 만난 자연의 풍경이 마음을 편안하게 해주네요. 내일도 꼭 다시 걸어야겠어요.'
      logImages = '/noImg.png'
    } else {
      reflection = `${routine.title} 루틴을 수행했어요. 꾸준히 하니 좋은 습관이 되고 있어요!`
      logImages = '/noImg.png'
    }

    const routineLog = await prisma.routineLog.create({
      data: {
        userId: routine.userId,
        routineId: createdRoutine.id,
        performedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        reflection: reflection,
        isPublic: true,
        logImg: logImages,
      },
    })

    // 유저 ID 배열
    const userIds = [
      '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
      'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6',
    ]
    const otherUserIds = userIds.filter((id) => id !== routine.userId)

    if (Math.random() > 0.5) {
      const commentUserId = otherUserIds[Math.floor(Math.random() * otherUserIds.length)]
      
      // 유저별 닉네임 매핑
      const userNicknames: { [key: string]: string } = {
        'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6': '따뜻한 고양이',
        'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6': '활발한 강아지',
        'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6': '신중한 거북이',
        '5be4a270-166c-4ec9-a1c7-2d82da8be7c8': '유쾌한 토끼',
      }

      await prisma.comment.create({
        data: {
          logId: routineLog.id,
          userId: commentUserId,
          content: '정말 좋은 습관이네요! 저도 도전해볼게요 👍',
          isDeleted: false,
        },
      })

      await prisma.notification.create({
        data: {
          userId: routine.userId,
          type: 'comment',
          content: `${userNicknames[commentUserId]}님이 회원님의 루틴 로그에 댓글을 남겼습니다.`,
          isRead: false,
        },
      })
    }

    if (Math.random() > 0.4) {
      const likeUserId = otherUserIds[Math.floor(Math.random() * otherUserIds.length)]

      // 유저별 닉네임 매핑
      const userNicknames: { [key: string]: string } = {
        'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6': '따뜻한 고양이',
        'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6': '활발한 강아지',
        'z1x2c3v4-b5n6-m7a8-s9d0-f1g2h3j4k5l6': '신중한 거북이',
        '5be4a270-166c-4ec9-a1c7-2d82da8be7c8': '유쾌한 토끼',
      }

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
          content: `${userNicknames[likeUserId]}님이 회원님의 루틴 로그를 좋아합니다.`,
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