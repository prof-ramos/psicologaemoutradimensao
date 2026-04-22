import type { HoroscopeResult } from '@/lib/horoscope'
import type { ValidMapaAstralParams } from './query'

interface MapaAstralShareMessages {
  url: string
  twitterMessage: string
  whatsappMessage: string
}

function buildMapaAstralUrl(params: ValidMapaAstralParams, baseUrl: string): string {
  const qs = new URLSearchParams({
    data: params.data,
    lat: params.lat,
    lng: params.lng,
  })

  if (params.hora) qs.set('hora', params.hora)
  if (params.cidade) qs.set('cidade', params.cidade)

  return `${baseUrl.replace(/\/$/, '')}/mapa-astral?${qs.toString()}`
}

export function buildMapaAstralShareMessages({
  result,
  params,
  baseUrl,
}: {
  result: HoroscopeResult
  params: ValidMapaAstralParams
  baseUrl: string
}): MapaAstralShareMessages {
  const url = buildMapaAstralUrl(params, baseUrl)
  const sun = result.positions.find((position) => position.key === 'sun')
  const moon = result.positions.find((position) => position.key === 'moon')
  const asc = result.ascendant

  const twitterParts: string[] = []
  if (sun) twitterParts.push(`Sol em ${sun.signPt}`)
  if (asc) twitterParts.push(`Asc em ${asc.signPt}`)
  if (moon) twitterParts.push(`Lua em ${moon.signPt}`)

  const twitterMessage = [
    'Calculei meu Mapa Astral 🔮',
    twitterParts.join(' · '),
    '',
    'Descubra o seu de graça 👇',
    url,
    '',
    'por @Gayaliz_',
  ].join('\n')

  const whatsappParts: string[] = []
  if (sun) whatsappParts.push(`Sol em ${sun.signPt}`)
  if (asc) whatsappParts.push(`Ascendente em ${asc.signPt}`)
  if (moon) whatsappParts.push(`Lua em ${moon.signPt}`)

  const waBody = whatsappParts.length
    ? ` — ${whatsappParts.slice(0, -1).join(', ')}${
        whatsappParts.length > 1 ? ` e ${whatsappParts.at(-1)}` : whatsappParts[0]
      }`
    : ''

  const whatsappMessage = [
    `Calculei meu Mapa Astral 🔮${waBody}.`,
    '',
    'Descubra o seu de graça, sem cadastro 👇',
    url,
    '',
    'por @Gayaliz_',
  ].join('\n')

  return { url, twitterMessage, whatsappMessage }
}
