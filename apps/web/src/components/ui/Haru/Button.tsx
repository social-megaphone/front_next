import { ButtonHTMLAttributes } from 'react'

interface Button_HaruProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  disabled?: boolean
}
export default function Button_Haru({ onClick, children, disabled }: Button_HaruProps) {
  const disabledStyle = disabled ? 'bg-gray-200' : 'bg-haru-brown'
  return (
    <button
      className={`${disabledStyle} text-white font-medium text-lg py-2 px-4 w-full rounded-full`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
