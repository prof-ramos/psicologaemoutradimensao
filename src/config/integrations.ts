import { siteConfig } from './site'
import { readTrimmedEnv } from './shared'

export const integrationsConfig = {
  revalidationSecret: readTrimmedEnv('REVALIDATION_SECRET'),
  freepikApiKey: readTrimmedEnv('FREEPIK_API_KEY'),
  freepikWebhookUrl: `${siteConfig.baseUrl.replace(/\/$/, '')}/api/icons/webhook`,
}
