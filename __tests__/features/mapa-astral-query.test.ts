import { parseMapaAstralParams } from '../../src/features/mapa-astral/query'

describe('parseMapaAstralParams', () => {
  it('returns empty when required params are absent', () => {
    expect(parseMapaAstralParams({})).toEqual({ kind: 'empty' })
  })

  it('parses valid params into normalized numbers and strings', () => {
    const parsed = parseMapaAstralParams({
      data: '1990-03-15',
      hora: '14:30',
      lat: '-23.5505',
      lng: '-46.6333',
      cidade: ' São Paulo ',
    })

    expect(parsed.kind).toBe('valid')
    if (parsed.kind !== 'valid') return
    expect(parsed.value.cidade).toBe('São Paulo')
    expect(parsed.value.year).toBe(1990)
    expect(parsed.value.hour).toBe(14)
    expect(parsed.value.latNumber).toBeCloseTo(-23.5505)
    expect(parsed.value.hasTime).toBe(true)
  })

  it('uses noon when time is omitted', () => {
    const parsed = parseMapaAstralParams({
      data: '1990-03-15',
      lat: '-23.55',
      lng: '-46.63',
    })

    expect(parsed.kind).toBe('valid')
    if (parsed.kind !== 'valid') return
    expect(parsed.value.hour).toBe(12)
    expect(parsed.value.minute).toBe(0)
    expect(parsed.value.hasTime).toBe(false)
  })

  it('uses the first non-empty value when repeated query params arrive as arrays', () => {
    const parsed = parseMapaAstralParams({
      data: ['', '1990-03-15'],
      hora: [' ', '14:30'],
      lat: ['', '-23.55'],
      lng: ['-46.63'],
      cidade: ['', ' São Paulo '],
    })

    expect(parsed.kind).toBe('valid')
    if (parsed.kind !== 'valid') return
    expect(parsed.value.data).toBe('1990-03-15')
    expect(parsed.value.hora).toBe('14:30')
    expect(parsed.value.cidade).toBe('São Paulo')
  })

  it('returns validation errors for invalid inputs', () => {
    expect(parseMapaAstralParams({
      data: 'invalido',
      lat: '-23.55',
      lng: '-46.63',
    })).toEqual({ kind: 'invalid', error: 'Data inválida.' })

    expect(parseMapaAstralParams({
      data: '1990-03-15',
      hora: '25:00',
      lat: '-23.55',
      lng: '-46.63',
    })).toEqual({ kind: 'invalid', error: 'Hora inválida.' })

    expect(parseMapaAstralParams({
      data: '1990-03-15',
      lat: '-123',
      lng: '-46.63',
    })).toEqual({ kind: 'invalid', error: 'Latitude inválida.' })
  })
})
