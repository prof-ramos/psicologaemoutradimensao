import crypto from 'crypto'
import { config } from '@/config'

export function signOgImageUrl({ title }: { title: string }): string {
  const params = new URLSearchParams({ title })
  const signature = crypto
    .createHmac('sha256', config.ogImageSecret)
    .update(params.toString())
    .digest('hex')
  return `${config.baseUrl}/api/og?${params}&sig=${signature}`
}
