import { Loader2 } from 'lucide-react'

export default function LoadingCard({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black/20 absolute inset-0" />
      <div className="max-w-md w-full z-50 px-4 h-full flex items-center justify-center">
        <div className="w-full h-60 bg-white border border-gray-200 rounded-2xl flex flex-col gap-2 items-center justify-center">
          <Loader2 className="w-16 h-16 text-haru-brown animate-spin" />
          {text && <div className="text-lg font-bold text-haru-brown">{text}</div>}
        </div>
      </div>
    </div>
  )
}
