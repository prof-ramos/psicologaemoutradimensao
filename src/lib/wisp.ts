import { buildWispClient, GetPostsResult, GetPostResult } from '@wisp-cms/client'
import { config } from '@/config'

export const wisp = buildWispClient({ blogId: config.wisp.blogId })
export type { GetPostsResult, GetPostResult }
