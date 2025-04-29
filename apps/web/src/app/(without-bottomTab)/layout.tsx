import TopGoBackBar from '@/components/layout/topBar/TopGobackBar'
import Icon from '@/components/ui/icons/Icon'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <TopGoBackBar />
      {children}
    </>
  )
}
