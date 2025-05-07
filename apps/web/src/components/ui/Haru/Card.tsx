export default function Card_Haru({ text }: { text: React.ReactNode }) {
  return (
    <div
      className="flex items-center text-center justify-center py-6 px-4 bg-white w-full rounded-3xl shadow-haru"
      style={{ whiteSpace: 'pre-line' }}
    >
      <div className="text-lg leading-6">{text}</div>
    </div>
  )
}
