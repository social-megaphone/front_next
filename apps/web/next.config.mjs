/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      {
        hostname: 'withus3bucket.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
