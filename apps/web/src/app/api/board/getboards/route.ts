import prisma from '@/lib/prisma'
import { Routine } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { tags } = body

  let routines: Routine[] = []
  const isAll = tags.length === 0 || tags.find((tag: string) => tag === '전체')
  if (isAll) {
    routines = await prisma.routine.findMany({
      // take: 10,
      // skip: (Number(page) - 1) * 10,
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    })
  } else {
    routines = await prisma.routine.findMany({
      where: {
        tag: {
          in: tags,
        },
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
      // take: 10,
      // skip: (Number(page) - 1) * 10,
    })
  }
  console.log(routines)

  return NextResponse.json({ routines })
}
