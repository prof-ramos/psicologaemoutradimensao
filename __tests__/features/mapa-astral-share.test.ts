import { buildMapaAstralShareMessages } from '../../src/features/mapa-astral/share'
import { calculateHoroscope } from '../../src/lib/horoscope'

const params = {
  data: '1990-03-15',
  hora: '14:30',
  lat: '-23.5505',
  lng: '-46.6333',
  cidade: 'São Paulo',
  year: 1990,
  month: 3,
  day: 15,
  hour: 14,
  minute: 30,
  latNumber: -23.5505,
  lngNumber: -46.6333,
  hasTime: true,
} as const

describe('buildMapaAstralShareMessages', () => {
  it('builds canonical url and both share messages', () => {
    const result = calculateHoroscope({
      year: params.year,
      month: params.month,
      day: params.day,
      hour: params.hour,
      minute: params.minute,
      lat: params.latNumber,
      lng: params.lngNumber,
      hasTime: params.hasTime,
    })

    const share = buildMapaAstralShareMessages({
      result,
      params,
      baseUrl: 'https://example.com/',
    })

    const shareUrl = new URL(share.url)
    expect(shareUrl.origin).toBe('https://example.com')
    expect(shareUrl.pathname).toBe('/mapa-astral')
    expect(shareUrl.searchParams.get('cidade')).toBe('São Paulo')
    expect(share.twitterMessage).toContain('Calculei meu Mapa Astral')
    expect(share.twitterMessage).toContain('https://example.com/mapa-astral?')
    expect(share.whatsappMessage).toContain('Descubra o seu de graça, sem cadastro')
  })
})
