import {
  MedalIcon,
  BookmarkIcon,
  HomeIcon,
  UserIcon,
  PlusIcon,
  BellIcon,
  HeartIcon,
  XIcon,
  LucideProps,
  ChevronLeftIcon,
} from 'lucide-react'

interface IconProps extends LucideProps {
  name: string
}

export default function Icon({ name, ...props }: IconProps) {
  const iconMap = {
    medal: <MedalIcon {...props} />,
    bookmark: <BookmarkIcon {...props} />,
    home: <HomeIcon {...props} />,
    user: <UserIcon {...props} />,
    add: <PlusIcon {...props} />,
    bell: <BellIcon {...props} />,
    chevronLeft: <ChevronLeftIcon {...props} />,
    heart: <HeartIcon {...props} />,
    x: <XIcon {...props} />,
  }

  return iconMap[name as keyof typeof iconMap] || null
}
