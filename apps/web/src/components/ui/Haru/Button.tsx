import { ButtonHTMLAttributes } from 'react'

interface Button_HaruProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  disabled?: boolean
}
export default function Button_Haru({ onClick, children, disabled }: Button_HaruProps) {
  const disabledStyle = disabled ? 'bg-gray-100 text-gray-400 font-normal' : 'bg-haru-brown text-white'
  return (
    <button
      className={`${disabledStyle} transition-all font-bold duration-300 text-lg py-2 px-4 w-full rounded-full`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
