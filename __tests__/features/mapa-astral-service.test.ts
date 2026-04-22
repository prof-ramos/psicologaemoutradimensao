import { getMapaAstralResult } from '../../src/features/mapa-astral/service'

describe('getMapaAstralResult', () => {
  it('returns horoscope result for valid params', () => {
    const result = getMapaAstralResult({
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
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.result.positions.length).toBeGreaterThan(0)
  })
})
