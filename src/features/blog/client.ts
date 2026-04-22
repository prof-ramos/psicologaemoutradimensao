import { buildWispClient } from '@wisp-cms/client'
import { cmsConfig } from '@/config/cms'

type WispClient = ReturnType<typeof buildWispClient>

let wispClient: WispClient | undefined

export function getWispClient(): WispClient | undefined {
  if (!cmsConfig.blogId) return undefined
  wispClient ??= buildWispClient({ blogId: cmsConfig.blogId })
  return wispClient
}
