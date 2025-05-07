export default function InitialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full p-8"
      style={{ backgroundImage: 'url(/images/haru_flower_pattern.png)' }}
    >
      {children}
    </div>
  )
}
