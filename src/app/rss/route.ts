import RSS from 'rss'
import { wisp } from '@/lib/wisp'
import { config } from '@/config'

export async function GET() {
  const { posts } = await wisp.getPosts({ limit: 20 })

  const feed = new RSS({
    title: config.blog.name,
    description: config.blog.metadata.description,
    feed_url: `${config.baseUrl}/rss`,
    site_url: config.baseUrl,
    language: 'pt-BR',
  })

  for (const post of posts) {
    feed.item({
      title: post.title,
      description: post.description ?? '',
      url: `${config.baseUrl}/blog/${post.slug}`,
      date: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    })
  }

  return new Response(feed.xml({ indent: true }), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
