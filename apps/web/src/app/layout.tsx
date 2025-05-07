import { Geist, Geist_Mono } from 'next/font/google'

import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { Metadata } from 'next'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: '하루잇',
  description: '하루잇',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
    maximumScale: 1,
    minimumScale: 1,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex flex-col h-screen frame w-full relative max-w-md mx-auto bg-background-yellow">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
