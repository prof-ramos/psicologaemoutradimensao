import { readTrimmedEnv } from './shared'

export const cmsConfig = {
  blogId: readTrimmedEnv('NEXT_PUBLIC_BLOG_ID'),
}
