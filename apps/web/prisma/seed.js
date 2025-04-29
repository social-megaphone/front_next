// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
        nickname: 'DefaultUser',
        goal: '건강한 습관 만들기',
        goalDuration: 30,
        level: 1,
        streak: 0,
      },
    })
  }

  const routine = await prisma.routine.create({
    data: {
      userId: '5be4a270-166c-4ec9-a1c7-2d82da8be7c8',
      title: '아침 물 한 잔 마시기',
      desc: '매일 아침 물 한 잔 마시기',
      thumbnailImg: 'https://withus3bucket.s3.ap-northeast-2.amazonaws.com/routine_water.png',
      isRecommended: true,
      tag: '생활습관',
    },
  })

  console.log('Created routine:', routine)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// To run this script, add the following to your package.json:
// "scripts": {
//   "seed": "ts-node --transpile-only prisma/seed.ts"
// }
// Then run: npm run seed
