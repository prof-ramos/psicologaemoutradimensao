import crypto from 'crypto'
import { config } from '@/config'

export function signOgImageUrl({ title }: { title: string }): string {
  if (!config.ogImageSecret) {
    throw new Error('OG image secret not configured')
  }
  const params = new URLSearchParams({ title })
  const signature = crypto
    .createHmac('sha256', config.ogImageSecret)
    .update(params.toString())
    .digest('hex')
  const url = new URL('/api/og', config.baseUrl)
  params.forEach((value, key) => url.searchParams.set(key, value))
  url.searchParams.set('sig', signature)
  return url.toString()
}
