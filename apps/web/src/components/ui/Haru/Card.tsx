export default function Card_Haru({ text }: { text: React.ReactNode }) {
  return (
    <div
      className="flex items-center text-center justify-center py-8 px-4 bg-white w-full rounded-3xl shadow-lg"
      style={{ whiteSpace: 'pre-line' }}
    >
      <div className="text-xl font-bold">{text}</div>
    </div>
  )
}
