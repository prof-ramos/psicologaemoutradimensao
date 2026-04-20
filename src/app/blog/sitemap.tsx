import type { MetadataRoute } from 'next'
import { wisp } from '@/lib/wisp'
import { config } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await wisp.getPosts({ limit: 'all' })
  return posts.map((post) => ({
    url: `${config.baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }))
}
