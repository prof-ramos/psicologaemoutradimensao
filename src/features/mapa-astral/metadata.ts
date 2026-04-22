import crypto from 'crypto'
import { ogConfig } from '@/config/og'
import { siteConfig } from '@/config/site'
import { signMapaAstralOgUrl } from '@/lib/og-image'
import type { Metadata } from 'next'
import type { ValidMapaAstralParams } from './query'

const MAPA_ASTRAL_PAGE_DESCRIPTION =
  'Calcule seu mapa natal gratuitamente — 100% open source, em português.'

const MAPA_ASTRAL_SITE_OG_IMAGE = {
  url: `${siteConfig.baseUrl}/api/og/site`,
  width: 1200,
  height: 630,
}

const MAPA_ASTRAL_BASE_METADATA: Metadata = {
  title: 'Mapa Astral',
  description: MAPA_ASTRAL_PAGE_DESCRIPTION,
  openGraph: {
    title: 'Mapa Astral',
    description: MAPA_ASTRAL_PAGE_DESCRIPTION,
    type: 'website',
    images: [MAPA_ASTRAL_SITE_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mapa Astral',
    description: MAPA_ASTRAL_PAGE_DESCRIPTION,
    images: [MAPA_ASTRAL_SITE_OG_IMAGE.url],
  },
}

export function buildMapaAstralMetadata(params?: ValidMapaAstralParams): Metadata {
  if (!params) return MAPA_ASTRAL_BASE_METADATA

  try {
    const ogUrl = signMapaAstralOgUrl({
      data: params.data,
      lat: params.lat,
      lng: params.lng,
      hora: params.hora,
      cidade: params.cidade,
    })

    return {
      ...MAPA_ASTRAL_BASE_METADATA,
      openGraph: {
        ...MAPA_ASTRAL_BASE_METADATA.openGraph,
        images: [{ url: ogUrl, width: 1200, height: 630 }],
      },
      twitter: {
        ...MAPA_ASTRAL_BASE_METADATA.twitter,
        images: [ogUrl],
      },
    }
  } catch {
    return MAPA_ASTRAL_BASE_METADATA
  }
}

export function verifyMapaAstralOgSignature(params: URLSearchParams): boolean {
  const toSign = new URLSearchParams()
  for (const key of ['data', 'lat', 'lng', 'hora', 'cidade']) {
    const value = params.get(key)
    if (value !== null) {
      toSign.set(key, value)
    }
  }

  const expected = crypto
    .createHmac('sha256', ogConfig.ogImageSecret)
    .update(toSign.toString())
    .digest('hex')
  const provided = params.get('sig') ?? ''
  const isHex = /^[0-9a-fA-F]+$/.test(provided)

  if (!isHex || provided.length !== expected.length) return false

  return crypto.timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'))
}
