import Link from 'next/link'
import { wisp } from '@/lib/wisp'
import { BlogPostCard } from '@/components/blog-post-card'
import { Button } from '@/components/ui/button'

export const revalidate = 3600

export default async function HomePage() {
  const { posts } = await wisp.getPosts({ limit: 6 })

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="font-heading text-4xl font-black md:text-6xl">
          PsicologaEm
          <span className="bg-main px-2">OutraDimensão</span>
        </h1>
        <p className="max-w-2xl font-base text-lg text-muted-foreground">
          Pensamentos, reflexões e histórias de outra dimensão.
        </p>
      </section>

      {posts.length > 0 ? (
        <>
          <section className="space-y-6">
            <h2 className="font-heading text-2xl font-black">Posts recentes</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/blog">Ver todos os posts</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="font-base text-muted-foreground">Em breve...</p>
      )}
    </div>
  )
}
