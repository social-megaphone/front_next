import { Post } from '@/stores/useBoardStore'
import { useToggleLike } from '@/hooks/query/useRoutineStatus'
import { useToggleBookmark } from '@/hooks/query/useBookmarks'
import { HeartIcon, BookmarkIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function PostCard({ post }: { post: Post }) {
  const router = useRouter()
  const { mutate: toggleLike } = useToggleLike()
  const { mutate: toggleBookmark } = useToggleBookmark()
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(post.id)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark(post.id)
  }

  return (
    <div
      onClick={() => router.push(`/routine/${post.id}`)}
      className="bg-white rounded-lg p-4 px-6 flex flex-col gap-2 items-center relative"
    >
      <PostCardHeader nickname={post.nickname} tag={post.tag} />
      <PostCardBody imgUrl={post.thumbnail} title={post.title} />
      <PostCardFooter
        title={post.title}
        desc={post.desc}
        liked={post.liked || false}
        bookmarked={post.bookmarked || false}
        handleLike={handleLike}
        handleBookmark={handleBookmark}
      />
    </div>
  )
}

function PostCardHeader({ nickname, tag }: { nickname: string; tag: string }) {
  return (
    <div className="flex items-center whitespace-nowrap justify-between w-full">
      <div className="flex items-end">
        <span className="text-xl text-gray-500">
          <span className="text-haru-brown font-bold">{nickname}님</span>의 잇루틴
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-gray-500 px-2 py-1 rounded-full bg-haru-brown text-white">{tag}</span>
      </div>
    </div>
  )
}

function PostCardBody({ imgUrl, title }: { imgUrl: string; title: string }) {
  return (
    <div className="flex items-center w-full relative aspect-video rounded-xl overflow-hidden">
      <Image src={imgUrl} alt={title} fill className="object-cover" />
    </div>
  )
}

function PostCardFooter({
  title,
  desc,
  liked,
  bookmarked,
  handleLike,
  handleBookmark,
}: {
  title: string
  desc: string
  liked: boolean
  bookmarked: boolean
  handleLike: (e: React.MouseEvent) => void
  handleBookmark: (e: React.MouseEvent) => void
}) {
  return (
    <div className="flex flex-col items-start w-full">
      <span className="text-lg font-bold flex items-center justify-between w-full">
        {title}{' '}
        <span className="text-gray-500 text-sm flex gap-2">
          <button onClick={handleLike}>
            {liked ? <HeartIcon className="text-red-500" fill="currentColor" /> : <HeartIcon />}
          </button>{' '}
          <button onClick={handleBookmark}>
            {bookmarked ? <BookmarkIcon className="text-haru-brown" fill="currentColor" /> : <BookmarkIcon />}
          </button>
        </span>
      </span>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}

export default PostCard
