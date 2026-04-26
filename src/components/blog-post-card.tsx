import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

const TAG_CLASSES = ['bg-cosmic-blue', 'bg-vibrant-pink', 'bg-electric-orange', 'bg-main']

interface Tag {
  id: string
  name: string
}

interface Post {
  id: string
  slug: string
  title: string
  description: string | null
  image: string | null
  publishedAt: Date | null
  tags: Tag[]
}

export function BlogPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      tabIndex={0}
      className={cn(
        'group flex flex-col gap-3 rounded-base border-2 border-border bg-background p-5',
        'shadow-shadow transition-all duration-200',
        'hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'
      )}
    >
      {post.image && (
        <div className="relative h-48 overflow-hidden border-2 border-border rounded-base">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag, i) => (
            <Badge key={tag.id} className={TAG_CLASSES[i % TAG_CLASSES.length]}>
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
      <h2 className="font-heading text-xl font-black text-foreground group-hover:underline">
        {post.title}
      </h2>
      {post.description && (
        <p className="line-clamp-3 font-base text-sm text-muted-foreground">
          {post.description}
        </p>
      )}
      {post.publishedAt && (
        <time
          dateTime={new Date(post.publishedAt).toISOString()}
          className="font-base text-xs text-muted-foreground"
        >
          {format(new Date(post.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </time>
      )}
    </Link>
  )
}
