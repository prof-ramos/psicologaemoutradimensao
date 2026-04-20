import { describe, expect, it } from '@jest/globals'
import { validateGeocodeQuery, MAX_QUERY_LENGTH } from '../../src/lib/geocode-validation'

describe('validateGeocodeQuery', () => {
  it('rejeita query vazia', () => {
    expect(validateGeocodeQuery('')).toBe(false)
  })

  it('rejeita query com 1 caractere', () => {
    expect(validateGeocodeQuery('S')).toBe(false)
  })

  it('aceita query com 2 caracteres (mínimo)', () => {
    expect(validateGeocodeQuery('SP')).toBe(true)
  })

  it('aceita cidade válida', () => {
    expect(validateGeocodeQuery('São Paulo')).toBe(true)
  })

  it('aceita cidade estrangeira', () => {
    expect(validateGeocodeQuery('Paris')).toBe(true)
  })

  it('aceita cidade com acentos', () => {
    expect(validateGeocodeQuery('Açaí')).toBe(true)
  })

  it('rejeita query muito longa', () => {
    expect(validateGeocodeQuery('A'.repeat(MAX_QUERY_LENGTH + 1))).toBe(false)
  })

  it('aceita query no limite máximo', () => {
    expect(validateGeocodeQuery('A'.repeat(MAX_QUERY_LENGTH))).toBe(true)
  })

  it('rejeita query com apenas espaços', () => {
    expect(validateGeocodeQuery('   ')).toBe(false)
  })

  it('rejeita null como any', () => {
    expect(validateGeocodeQuery(null as unknown as string)).toBe(false)
  })

  it('rejeita undefined como any', () => {
    expect(validateGeocodeQuery(undefined as unknown as string)).toBe(false)
  })
})
