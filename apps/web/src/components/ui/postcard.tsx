import { Post } from '@/stores/useBoardStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function PostCard({ post }: { post: Post }) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/routine/${post.id}`)}
      className="bg-white rounded-lg p-4 px-6 flex flex-col gap-2 items-center"
    >
      <PostCardHeader nickname={post.nickname} tag={post.tag} />
      <PostCardBody imgUrl={post.thumbnail} title={post.title} />
      <PostCardFooter title={post.title} desc={post.desc} />
    </div>
  )
}

function PostCardHeader({ nickname, tag }: { nickname: string; tag: string }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-end">
        <span className="text-2xl text-gray-500">
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
    <div className="flex items-center w-full relative aspect-video  rounded-xl overflow-hidden">
      <Image src={imgUrl} alt={title} fill className="object-cover" />
    </div>
  )
}

function PostCardFooter({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-start w-full">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}

export default PostCard
