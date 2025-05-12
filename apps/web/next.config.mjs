/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    unoptimized: true, // 로컬 이미지 최적화 비활성화 (선택적)

    path: '/',
    remotePatterns: [
      {
        hostname: 'withus3bucket.s3.ap-northeast-2.amazonaws.com',
      },
      {
        hostname: 'socialmegaphone.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
