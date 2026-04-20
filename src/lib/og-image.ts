import { config } from '@/config'
import crypto from 'crypto'

export function signOgImageUrl({ title }: { title: string }): string {
  if (!config.ogImageSecret) {
    throw new Error('OG image secret not configured')
  }
  if (!config.baseUrl) {
    throw new Error('baseUrl not configured')
  }
  const baseUrl = config.baseUrl.replace(/\/$/, '')
  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    throw new Error('OG image title required')
  }
  const params = new URLSearchParams({ title: trimmedTitle })
  const signature = crypto
    .createHmac('sha256', config.ogImageSecret)
    .update(params.toString())
    .digest('hex')
  const url = new URL('/api/og', baseUrl)
  params.forEach((value, key) => url.searchParams.set(key, value))
  url.searchParams.set('sig', signature)
  return url.toString()
}
