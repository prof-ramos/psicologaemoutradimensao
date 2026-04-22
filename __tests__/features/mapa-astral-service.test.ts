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
    expect(result.result.positions.some((position) => position.namePt === 'Sol')).toBe(true)
    expect(result.result.positions.some((position) => position.namePt === 'Lua')).toBe(true)

    for (const position of result.result.positions) {
      expect(position.namePt).toEqual(expect.any(String))
      expect(position.namePt.length).toBeGreaterThan(0)
      expect(position.signPt).toEqual(expect.any(String))
      expect(position.signPt.length).toBeGreaterThan(0)
      expect(position.decimalDegrees).toBeGreaterThanOrEqual(0)
      expect(position.decimalDegrees).toBeLessThan(360)
      expect(Number.isInteger(position.house)).toBe(true)
      expect(position.house).toBeGreaterThanOrEqual(1)
      expect(position.house).toBeLessThanOrEqual(12)
    }
  })
})
