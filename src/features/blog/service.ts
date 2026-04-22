import { unstable_cache } from 'next/cache'
import { wisp } from './client'

const BLOG_REVALIDATE_SECONDS = 3600

const getPostsPageCached = unstable_cache(
  async (page: number, limit: number) => wisp.getPosts({ page, limit }),
  ['blog-posts-page'],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: ['wisp-posts'] }
)

const getAllPostsCached = unstable_cache(
  async () => {
    const result = await wisp.getPosts({ limit: 'all' })
    return result.posts
  },
  ['blog-posts-all'],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: ['wisp-posts'] }
)

const getPostBySlugCached = unstable_cache(
  async (slug: string) => wisp.getPost(slug),
  ['wisp-post'],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: ['wisp-post'] }
)

export async function getBlogPostsPage(page: number, limit: number) {
  return getPostsPageCached(page, limit)
}

export async function getRecentBlogPosts(limit: number) {
  const result = await getBlogPostsPage(1, limit)
  return result.posts
}

export async function getAllBlogPosts() {
  return getAllPostsCached()
}

export async function getBlogPostBySlug(slug: string) {
  return getPostBySlugCached(slug)
}
