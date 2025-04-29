import Icon from '@/components/ui/icons/Icon'

export default function TopAlarm() {
  return (
    <div className="absolute top-4 right-4 h-14 z-50">
      <div className="flex items-center justify-center w-14 h-14 p-1 bg-main-yellow rounded-2xl shadow-sm">
        <Icon name="bell" />
      </div>
    </div>
  )
}
