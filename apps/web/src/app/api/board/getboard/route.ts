import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tags = searchParams.get('tags')

  return NextResponse.json({ message: 'Hello, world!' })
}
