import { config } from '@/config'
import { wisp } from '@/lib/wisp'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { posts } = await wisp.getPosts({ limit: 'all' })

    const latestDate = posts.reduce((max, post) => {
      if (!post.publishedAt) return max
      const d = new Date(post.publishedAt)
      return d > max ? d : max
    }, new Date(0))

    const blogLastModified = latestDate.getTime() > 0 ? latestDate : new Date()

    return [
      { url: `${config.baseUrl}/blog/`, lastModified: blogLastModified },
      ...posts.map((post) => ({
        url: `${config.baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : blogLastModified,
      })),
    ]
  } catch (err) {
    console.error('sitemap generation error:', err)
    return [{ url: `${config.baseUrl}/blog/`, lastModified: new Date() }]
  }
}
