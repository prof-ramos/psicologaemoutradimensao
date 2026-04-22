import { readTrimmedEnv } from './shared'

export const ogConfig = {
  ogImageSecret: readTrimmedEnv('OG_IMAGE_SECRET'),
}
