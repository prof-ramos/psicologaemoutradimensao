import { siteConfig } from './site'
import { getProductionRequiredSecret, readTrimmedEnv } from './shared'

export const integrationsConfig = {
  revalidationSecret: getProductionRequiredSecret('REVALIDATION_SECRET'),
  freepikApiKey: readTrimmedEnv('FREEPIK_API_KEY'),
  freepikWebhookUrl: `${siteConfig.baseUrl.replace(/\/$/, '')}/api/icons/webhook`,
}
