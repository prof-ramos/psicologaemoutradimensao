import { requireTrimmedEnv } from './shared'

export const cmsConfig = {
  blogId: requireTrimmedEnv('NEXT_PUBLIC_BLOG_ID'),
}
