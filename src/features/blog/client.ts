import { buildWispClient } from '@wisp-cms/client'
import { cmsConfig } from '@/config/cms'

export const wisp = buildWispClient({ blogId: cmsConfig.blogId })
