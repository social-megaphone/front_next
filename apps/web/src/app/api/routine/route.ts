import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/services/token.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const startTime = performance.now()

  try {
    const tag = request.nextUrl.searchParams.get('tag') || ''
    console.log(`🚀 [Routine API] Start - Tag: ${tag}`)

    // 1. 쿠키 검증 시간 측정
    const cookieStart = performance.now()
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token') || {
      value: request.headers.get('Authorization')?.split(' ')[1],
    }

    if (!jwt_token || !jwt_token.value) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const cookieEnd = performance.now()
    console.log(`⏱️ [Cookie] ${(cookieEnd - cookieStart).toFixed(2)}ms`)

    // 2. JWT 토큰 검증 시간 측정
    const jwtStart = performance.now()
    const userId = await getUserIdFromToken({ token: jwt_token.value })
    const jwtEnd = performance.now()
    console.log(`⏱️ [JWT Verify] ${(jwtEnd - jwtStart).toFixed(2)}ms`)

    // 3. DB 쿼리 시간 측정 및 최적화
    const dbStart = performance.now()
    let routines = []

    if (tag) {
      // 인덱스 활용을 위한 쿼리 최적화
      routines = await prisma.routine.findMany({
        where: {
          tag: {
            has: tag,
          },
          isActive: true, // 활성 루틴만 조회
        },
        select: {
          // 필요한 필드만 선택하여 네트워크 부하 감소
          id: true,
          title: true,
          desc: true,
          how: true,
          icon: true,
          color: true,
          detailImg: true,
          isRecommended: true,
          tag: true,
          category: true,
          createdAt: true,
          userId: true,
        },
        orderBy: [
          { isRecommended: 'desc' }, // 추천 루틴 우선
          { createdAt: 'desc' }, // 최신순
        ],
        take: 50, // 페이지네이션 (필요시)
      })
    } else {
      // 전체 조회시에도 최적화 적용
      routines = await prisma.routine.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          desc: true,
          how: true,
          icon: true,
          color: true,
          detailImg: true,
          isRecommended: true,
          tag: true,
          category: true,
          createdAt: true,
          userId: true,
        },
        orderBy: [{ isRecommended: 'desc' }, { createdAt: 'desc' }],
        take: 50,
      })
    }

    const dbEnd = performance.now()
    console.log(`⏱️ [DB Query] ${(dbEnd - dbStart).toFixed(2)}ms`)
    console.log(`📊 [Result Count] ${routines.length} routines`)

    const endTime = performance.now()
    const totalTime = endTime - startTime
    console.log(`✅ [Total Time] ${totalTime.toFixed(2)}ms`)

    // 성능 경고
    if (totalTime > 1000) {
      console.warn(`⚠️ [Performance Warning] API took ${totalTime.toFixed(2)}ms`)
    }

    return NextResponse.json({
      routines,
      meta: {
        count: routines.length,
        processingTime: `${totalTime.toFixed(2)}ms`,
        tag: tag || 'all',
      },
    })
  } catch (error) {
    const endTime = performance.now()
    const totalTime = endTime - startTime

    console.error(`❌ [Routine API Error] Time: ${totalTime.toFixed(2)}ms`, error)
    return NextResponse.json({ message: 'Failed to fetch routines', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const startTime = performance.now()

  try {
    console.log('🚀 [Routine Log POST] Start')

    // 1. 요청 데이터 파싱
    const parseStart = performance.now()
    const { routineId, logImg, reflection } = await request.json()
    const parseEnd = performance.now()
    console.log(`⏱️ [JSON Parse] ${(parseEnd - parseStart).toFixed(2)}ms`)

    // 2. 인증 처리
    const authStart = performance.now()
    const cookieStore = await cookies()
    const jwt_token = cookieStore.get('jwt_token') || {
      value: request.headers.get('Authorization')?.split(' ')[1],
    }

    if (!jwt_token.value || !jwt_token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getUserIdFromToken({ token: jwt_token.value })
    const authEnd = performance.now()
    console.log(`⏱️ [Auth] ${(authEnd - authStart).toFixed(2)}ms`)

    // 3. DB 생성 작업
    const dbStart = performance.now()
    const routineLog = await prisma.routineLog.create({
      data: {
        userId,
        routineId,
        logImg,
        reflection,
        performedAt: new Date(),
        isPublic: true,
      },
      select: {
        id: true,
        performedAt: true,
        reflection: true,
        logImg: true,
      },
    })
    const dbEnd = performance.now()
    console.log(`⏱️ [DB Create] ${(dbEnd - dbStart).toFixed(2)}ms`)

    const endTime = performance.now()
    const totalTime = endTime - startTime
    console.log(`✅ [POST Total Time] ${totalTime.toFixed(2)}ms`)

    return NextResponse.json({
      message: 'success',
      routineLog,
      meta: {
        processingTime: `${totalTime.toFixed(2)}ms`,
      },
    })
  } catch (error) {
    const endTime = performance.now()
    const totalTime = endTime - startTime

    console.error(`❌ [Routine Log Creation Error] Time: ${totalTime.toFixed(2)}ms`, error)
    return NextResponse.json({ message: 'Failed to create routine log', error: String(error) }, { status: 500 })
  }
}
