import {
  MedalIcon,
  BookmarkIcon,
  HomeIcon,
  UserIcon,
  PlusIcon,
  BellIcon,
  ArrowLeftIcon,
  LucideProps,
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
    arrowLeft: <ArrowLeftIcon {...props} />,
  }

  return iconMap[name as keyof typeof iconMap] || null
}
