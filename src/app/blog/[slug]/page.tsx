import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { wisp } from '@/lib/wisp'
import { BlogPostContent } from '@/components/blog-post-content'
import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'
import Image from 'next/image'

export const revalidate = 3600

const TAG_VARIANTS: Array<BadgeProps['variant']> = ['blue', 'pink', 'orange', 'default']

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { posts } = await wisp.getPosts({ limit: 'all' })
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await wisp.getPost(slug)
  if (!result?.post) return {}
  const { post } = result
  return {
    title: post.title,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const result = await wisp.getPost(slug)

  if (!result?.post) notFound()

  const { post } = result

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <header className="space-y-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <Badge key={tag.id} variant={TAG_VARIANTS[i % TAG_VARIANTS.length]}>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        <h1 className="font-heading text-4xl font-black md:text-5xl">{post.title}</h1>
        {post.description && (
          <p className="font-base text-lg text-muted-foreground">{post.description}</p>
        )}
        {post.publishedAt && (
          <time className="block border-l-4 border-main pl-3 font-base text-sm text-muted-foreground">
            {format(new Date(post.publishedAt), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </time>
        )}
      </header>

      {post.image && (
        <div className="relative aspect-video border-2 border-border shadow-shadow">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <BlogPostContent content={post.content} />
    </article>
  )
}
