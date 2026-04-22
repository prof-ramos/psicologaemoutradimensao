import { unstable_cache } from 'next/cache'
import { getWispClient } from './client'

const BLOG_REVALIDATE_SECONDS = 3600
const EMPTY_POSTS_PAGE = {
  posts: [],
  pagination: { page: 1, totalPosts: 0, limit: 0, totalPages: 1, nextPage: null, prevPage: null },
}

const getPostsPageCached = unstable_cache(
  async (page: number, limit: number) => {
    const wisp = getWispClient()
    if (!wisp) return { ...EMPTY_POSTS_PAGE, pagination: { ...EMPTY_POSTS_PAGE.pagination, page, limit } }
    return wisp.getPosts({ page, limit })
  },
  ['blog-posts-page'],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: ['wisp-posts'] }
)

const getAllPostsCached = unstable_cache(
  async () => {
    const wisp = getWispClient()
    if (!wisp) return []
    const result = await wisp.getPosts({ limit: 'all' })
    return result.posts
  },
  ['blog-posts-all'],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: ['wisp-posts'] }
)

const getPostBySlugCached = unstable_cache(
  async (slug: string) => {
    const wisp = getWispClient()
    if (!wisp) return { post: null }
    return wisp.getPost(slug)
  },
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
