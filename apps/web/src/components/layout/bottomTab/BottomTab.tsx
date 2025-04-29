'use client'
import Icon from '@/components/ui/icons/Icon'
import { cn } from '@workspace/ui/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabItems = [
  {
    id: 1,
    name: 'home',
    icon: 'home',
    position: 'left',
  },
  {
    id: 2,
    name: 'bookmark',
    icon: 'bookmark',
    position: 'left',
  },
  {
    id: 3,
    name: 'add',
    icon: 'add',
    position: 'center',
  },
  {
    id: 4,
    name: 'badge',
    icon: 'medal',
    position: 'right',
  },
  {
    id: 5,
    name: 'mypage',
    icon: 'user',
    position: 'right',
  },
]

export default function BottomTab() {
  const pathname = usePathname()
  return (
    <footer className="w-full h-16 px-4 absolute bottom-4">
      <div
        className="flex items-center bg-main-yellow rounded-full justify-center w-full h-full py-1"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        {tabItems.map((item) =>
          item.position === 'center' ? (
            <div key={item.id} className="flex items-center justify-center w-full">
              <Link
                href={`/${item.name}`}
                className="flex items-center justify-center w-11 h-11 bg-haru-brown rounded-full"
              >
                <Icon name={item.icon} stroke="#FFF2CD" className="w-10 h-10" />
              </Link>
            </div>
          ) : (
            <Link
              key={item.id}
              href={`/${item.name}`}
              className={cn(
                'flex items-center justify-center w-full h-full',
                pathname === item.name && 'bg-main-yellow',
              )}
            >
              <Icon
                name={item.icon}
                fill={pathname.includes(item.name) ? 'rgba(140, 113, 84, 1)' : 'rgba(140, 113, 84, 0.37)'}
                stroke={pathname.includes(item.name) ? 'rgba(140, 113, 84, 0.37)' : 'rgba(140, 113, 84, 0.37)'}
              />
            </Link>
          ),
        )}
      </div>
    </footer>
  )
}
