import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BadgeProps } from '@/components/ui/badge'

const TAG_VARIANTS: Array<BadgeProps['variant']> = ['blue', 'pink', 'orange', 'default']

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
      className={cn(
        'group flex flex-col gap-3 rounded-base border-2 border-border bg-background p-5',
        'shadow-shadow transition-all duration-200',
        'hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'
      )}
    >
      {post.image && (
        <div className="overflow-hidden border-2 border-border">
          <img
            src={post.image}
            alt={post.title}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag, i) => (
            <Badge key={tag.id} variant={TAG_VARIANTS[i % TAG_VARIANTS.length]}>
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
        <time className="font-base text-xs text-muted-foreground">
          {format(new Date(post.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </time>
      )}
    </Link>
  )
}
