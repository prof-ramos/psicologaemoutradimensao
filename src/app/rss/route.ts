import { getRecentBlogPosts } from '@/features/blog'
import { siteConfig } from '@/config/site'
import RSS from 'rss'

export const revalidate = 3600

export async function GET() {
  let posts
  try {
    posts = await getRecentBlogPosts(20)
  } catch (err) {
    console.error('getRecentBlogPosts error:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const feed = new RSS({
    title: siteConfig.blog.name,
    description: siteConfig.blog.metadata.description,
    feed_url: `${siteConfig.baseUrl}/rss`,
    site_url: siteConfig.baseUrl,
    language: 'pt-BR',
  })

  for (const post of posts) {
    if (!post.publishedAt) continue
    feed.item({
      title: post.title,
      description: post.description ?? '',
      url: `${siteConfig.baseUrl}/blog/${post.slug}`,
      date: new Date(post.publishedAt),
    })
  }

  const xml = feed.xml({ indent: true })
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
