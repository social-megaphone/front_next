import { Geist, Geist_Mono } from 'next/font/google'

import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import BottomTab from '@/components/layout/bottomTab/BottomTab'
import { Metadata } from 'next'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const metadata: Metadata = {
  title: '하루잇',
  description: '하루잇',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-background-yellow`}>
        <Providers>
          <div className="flex flex-col flex-1 h-screen w-full relative max-w-xl mx-auto">
            {children}
            <BottomTab />
          </div>
        </Providers>
      </body>
    </html>
  )
}
