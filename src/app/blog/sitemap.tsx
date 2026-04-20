import type { MetadataRoute } from 'next'
import { wisp } from '@/lib/wisp'
import { config } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: `${config.baseUrl}/blog/`, lastModified: new Date() },
  ]

  try {
    const { posts } = await wisp.getPosts({ limit: 'all' })
    return [
      ...base,
      ...posts.map((post) => ({
        url: `${config.baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      })),
    ]
  } catch {
    return base
  }
}
