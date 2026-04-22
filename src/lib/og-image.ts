import { config } from '@/config'
import crypto from 'crypto'

export function signMapaAstralOgUrl(params: {
  data: string
  lat: string
  lng: string
  hora?: string
  cidade?: string
}): string {
  if (!config.ogImageSecret) {
    throw new Error('OG image secret not configured')
  }
  if (!config.baseUrl) {
    throw new Error('baseUrl not configured')
  }
  if (!params.data) throw new Error('OG image: data is required')
  if (!params.lat)  throw new Error('OG image: lat is required')
  if (!params.lng)  throw new Error('OG image: lng is required')

  const baseUrl = config.baseUrl.replace(/\/$/, '')
  const base = new URLSearchParams()
  base.set('data', params.data)
  base.set('lat', params.lat)
  base.set('lng', params.lng)
  if (params.hora) base.set('hora', params.hora)
  if (params.cidade) base.set('cidade', params.cidade)
  const sig = crypto
    .createHmac('sha256', config.ogImageSecret)
    .update(base.toString())
    .digest('hex')
  base.set('sig', sig)
  return `${baseUrl}/api/og?${base.toString()}`
}

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
