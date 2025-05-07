import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt_token')
  console.log('token', token)

  if (request.nextUrl.pathname.includes('/initial')) {
    return NextResponse.next()
  }
  if (request.nextUrl.pathname.includes('/api/')) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/initial', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\.png|.*\.jpg|.*\.jpeg).*)'],
}
