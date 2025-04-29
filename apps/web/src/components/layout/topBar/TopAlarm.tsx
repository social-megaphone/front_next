import Icon from '@/components/ui/icons/Icon'

export default function TopAlarm() {
  return (
    <div className="absolute top-4 right-4 h-16">
      <div className="flex items-center justify-center w-16 h-16 p-2 bg-main-yellow rounded-2xl shadow-sm">
        <Icon name="bell" className="" />
      </div>
    </div>
  )
}
