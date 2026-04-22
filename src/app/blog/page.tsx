import type { Metadata } from 'next'
import { wisp } from '@/lib/wisp'
import { BlogPostCard } from '@/components/blog-post-card'
import { BlogPostsPagination } from '@/components/blog-posts-pagination'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Todos os posts',
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams
  const parsed = parseInt(pageParam ?? '1', 10)
  const page = Number.isInteger(parsed) && parsed >= 1 ? parsed : 1
  const limit = 6

  let posts: Awaited<ReturnType<typeof wisp.getPosts>>['posts'] = []
  let pagination: Awaited<ReturnType<typeof wisp.getPosts>>['pagination'] = { page: 1, totalPosts: 0, limit: 6, totalPages: 1, nextPage: null, prevPage: null }

  try {
    const result = await wisp.getPosts({ limit, page })
    posts = result.posts
    pagination = result.pagination
  } catch (err) {
    console.error('wisp.getPosts error:', err)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="font-heading text-4xl font-black">Blog</h1>

      {posts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          <BlogPostsPagination
            pagination={{
              page: pagination.page,
              totalPosts: pagination.totalPosts,
              limit: typeof pagination.limit === 'number' ? pagination.limit : limit,
            }}
          />
        </>
      ) : (
        <p className="font-base text-muted-foreground">Nenhum post ainda.</p>
      )}
    </div>
  )
}
