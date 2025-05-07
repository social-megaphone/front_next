import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag') || ''
  let routines = []
  if (tag) {
    routines = await prisma.routine.findMany({
      where: {
        tag: tag,
      },
    })
  } else {
    routines = await prisma.routine.findMany({})
  }
  return NextResponse.json(routines)
}
