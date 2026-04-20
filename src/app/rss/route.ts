import { config } from '@/config'
import { wisp } from '@/lib/wisp'
import RSS from 'rss'

export const revalidate = 3600

export async function GET() {
  let posts
  try {
    const result = await wisp.getPosts({ limit: 20 })
    posts = result.posts
  } catch (err) {
    console.error('wisp.getPosts error:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const feed = new RSS({
    title: config.blog.name,
    description: config.blog.metadata.description,
    feed_url: `${config.baseUrl}/rss`,
    site_url: config.baseUrl,
    language: 'pt-BR',
  })

  for (const post of posts) {
    if (!post.publishedAt) continue
    feed.item({
      title: post.title,
      description: post.description ?? '',
      url: `${config.baseUrl}/blog/${post.slug}`,
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
