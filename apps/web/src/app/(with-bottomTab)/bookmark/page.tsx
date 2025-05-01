'use client'

import { useBookmarks } from '@/hooks/query/useBookmarks'
import { useBookmarkStore } from '@/stores/useBookmarkStore'
import PostCard from '@/components/ui/PostCard'
import { PostCardSkeleton } from '@/components/ui/PostCard/Skeleton'
import TopAlarm from '@/components/layout/topBar/TopAlarm'

export default function BookmarkPage() {
  const { isPending } = useBookmarks()
  const { bookmarks } = useBookmarkStore()

  return (
    <main className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <TopAlarm />
      <section className="pt-12 pb-6">
        <h1 className="text-3xl font-bold text-haru-brown pl-10">북마크</h1>
      </section>

      <div className="flex flex-col gap-6 py-4 px-6 flex-1 last:mb-20">
        {isPending ? (
          Array.from({ length: 3 }).map((_, index) => <PostCardSkeleton key={index} />)
        ) : bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <PostCard
              key={bookmark.bookmarkId}
              post={{
                id: bookmark.id,
                nickname: bookmark.nickname,
                title: bookmark.title,
                desc: bookmark.desc,
                logImg: bookmark.logImg,
                reflection: bookmark.reflection,
                tag: bookmark.tag,
                performedAt: bookmark.performedAt,
                bookmarked: bookmark.isBookmarked,
                liked: bookmark.liked,
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 text-lg">북마크한 루틴이 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  )
}
