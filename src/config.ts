import { cmsConfig } from '@/config/cms'
import { integrationsConfig } from '@/config/integrations'
import { ogConfig } from '@/config/og'
import { siteConfig } from '@/config/site'

export interface AppConfig {
  baseUrl: string
  blog: {
    name: string
    metadata: {
      title: {
        absolute: string
        default: string
        template: string
      }
      description: string
    }
  }
  ogImageSecret?: string
  revalidationSecret?: string
  wisp: { blogId?: string }
}

export const config: AppConfig = {
  baseUrl: siteConfig.baseUrl,
  blog: siteConfig.blog,
  ogImageSecret: ogConfig.ogImageSecret,
  revalidationSecret: integrationsConfig.revalidationSecret,
  wisp: { blogId: cmsConfig.blogId },
}
