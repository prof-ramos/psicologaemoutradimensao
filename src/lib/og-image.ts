import { ogConfig } from '@/config/og'
import { siteConfig } from '@/config/site'
import crypto from 'crypto'

export function signMapaAstralOgUrl(params: {
  data: string
  lat: string
  lng: string
  hora?: string
  cidade?: string
}): string {
  if (!ogConfig.ogImageSecret) {
    throw new Error('OG image secret not configured')
  }
  if (!siteConfig.baseUrl) {
    throw new Error('baseUrl not configured')
  }
  if (!params.data) throw new Error('OG image: data is required')
  if (!params.lat)  throw new Error('OG image: lat is required')
  if (!params.lng)  throw new Error('OG image: lng is required')

  const baseUrl = siteConfig.baseUrl.replace(/\/$/, '')
  const base = new URLSearchParams()
  base.set('data', params.data)
  base.set('lat', params.lat)
  base.set('lng', params.lng)
  if (params.hora) base.set('hora', params.hora)
  if (params.cidade) base.set('cidade', params.cidade)
  const sig = crypto
    .createHmac('sha256', ogConfig.ogImageSecret)
    .update(base.toString())
    .digest('hex')
  base.set('sig', sig)
  return `${baseUrl}/api/og?${base.toString()}`
}
