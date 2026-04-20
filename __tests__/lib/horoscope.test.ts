import { calculateHoroscope } from '../../src/lib/horoscope'

const BASE_INPUT = {
  year: 1990, month: 3, day: 15,    // 15 de março de 1990
  hour: 14,   minute: 30,
  lat: -23.5505, lng: -46.6333,     // São Paulo
  hasTime: true,
}

describe('calculateHoroscope', () => {
  it('retorna planetas no formato AstroChart (Sun, Moon, etc.)', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.planets).toHaveProperty('Sun')
    expect(result.planets).toHaveProperty('Moon')
    expect(Array.isArray(result.planets['Sun'])).toBe(true)
    expect(result.planets['Sun'][0]).toBeGreaterThanOrEqual(0)
    expect(result.planets['Sun'][0]).toBeLessThan(360)
  })

  it('retorna 12 cúspides quando hasTime=true', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.cusps).toHaveLength(12)
    expect(result.hasHouses).toBe(true)
  })

  it('retorna cusps vazio e hasHouses=false quando hasTime=false', () => {
    const result = calculateHoroscope({ ...BASE_INPUT, hasTime: false })
    expect(result.cusps).toHaveLength(0)
    expect(result.hasHouses).toBe(false)
  })

  it('planetas retrógrados têm -0.2 como segundo elemento', () => {
    const result = calculateHoroscope(BASE_INPUT)
    for (const values of Object.values(result.planets)) {
      expect(values.length).toBeGreaterThanOrEqual(1)
      expect(values.length).toBeLessThanOrEqual(2)
      if (values.length === 2) {
        expect(values[1]).toBe(-0.2)
      }
    }
  })

  it('posições têm signo em pt-BR', () => {
    const result = calculateHoroscope(BASE_INPUT)
    const validSigns = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem',
                        'Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
    for (const pos of result.positions) {
      expect(validSigns).toContain(pos.signPt)
    }
  })

  it('planetas têm nome em pt-BR', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.positions.map(p => p.namePt)).toContain('Sol')
    expect(result.positions.map(p => p.namePt)).toContain('Lua')
  })

  it('retorna aspectos com estrutura correta', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(Array.isArray(result.aspects)).toBe(true)
    for (const asp of result.aspects) {
      expect(asp).toHaveProperty('planet1')
      expect(asp).toHaveProperty('planet2')
      expect(asp).toHaveProperty('typePt')
      expect(typeof asp.orb).toBe('number')
    }
  })

  it('retorna ascendente em signo pt-BR quando hasTime=true', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.ascendant).toBeDefined()
    const validSigns = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem',
                        'Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
    expect(validSigns).toContain(result.ascendant!.signPt)
    expect(result.ascendant!.degree).toBeGreaterThanOrEqual(0)
    expect(result.ascendant!.degree).toBeLessThan(360)
  })

  it('retorna MC em signo pt-BR quando hasTime=true', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.midheaven).toBeDefined()
    const validSigns = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem',
                        'Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
    expect(validSigns).toContain(result.midheaven!.signPt)
    expect(result.midheaven!.degree).toBeGreaterThanOrEqual(0)
    expect(result.midheaven!.degree).toBeLessThan(360)
  })

  it('ascendente e MC são undefined quando hasTime=false', () => {
    const result = calculateHoroscope({ ...BASE_INPUT, hasTime: false })
    expect(result.ascendant).toBeUndefined()
    expect(result.midheaven).toBeUndefined()
  })
})
