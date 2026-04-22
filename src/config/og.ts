import { getProductionRequiredSecret } from './shared'

export const ogConfig = {
  ogImageSecret: getProductionRequiredSecret('OG_IMAGE_SECRET'),
}
