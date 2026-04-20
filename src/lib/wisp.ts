import { buildWispClient, GetPostsResult, GetPostResult } from '@wisp-cms/client'
import { config } from '@/config'

if (!config.wisp.blogId) {
  throw new Error('Missing WISP blogId: set NEXT_PUBLIC_BLOG_ID')
}

export const wisp = buildWispClient({ blogId: config.wisp.blogId })
export type { GetPostsResult, GetPostResult }
