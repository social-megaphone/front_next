import { Skeleton } from '@workspace/ui/components/skeleton'

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 animate-[pulse_1s_ease-in-out_infinite] px-6 flex flex-col gap-2 items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-end">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="flex items-center w-full relative aspect-video rounded-xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex flex-col items-start w-full gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}
