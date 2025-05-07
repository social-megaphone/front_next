import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const Bucket = process.env.AWS_BUCKET_NAME || ''

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})
export async function POST(req: NextRequest) {
  try {
    // 폼 데이터 처리
    const formData = await req.formData()
    const files = formData.getAll('img') as File[]

    // 업로드할 이미지 파일 수 제한
    if (files.length > 3) {
      return NextResponse.json(
        {
          message: '업로드할 수 있는 이미지 파일의 수는 최대 3장입니다.',
        },
        { status: 400 },
      )
    }

    // 이미지 파일을 S3에 업로드
    const uploadPromises = files.map(async (file) => {
      const Body = Buffer.from(await file.arrayBuffer())
      const Key = file.name
      const ContentType = file.type || 'image/jpg'

      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
          ContentType,
        }),
      )

      return [`https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`]
    })

    const imgUrls = await Promise.all(uploadPromises)

    // 파일의 개수가 1이면 배열 대신 단일 URL 반환
    if (imgUrls.length === 1) {
      return NextResponse.json({ data: imgUrls[0], message: 'OK' }, { status: 200 })
    }

    return NextResponse.json({ data: [...imgUrls], message: 'OK' }, { status: 200 })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json({ message: '파일 업로드 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
