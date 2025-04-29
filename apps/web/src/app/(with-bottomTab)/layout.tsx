import BottomTab from '@/components/layout/bottomTab/BottomTab'

export default function WithBottomTabLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <BottomTab />
    </>
  )
}
