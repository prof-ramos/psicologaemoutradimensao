/**
 * @jest-environment node
 */

import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { validateGeocodeQuery, MAX_QUERY_LENGTH } from '../../src/lib/geocode-validation'
import { GET } from '../../src/app/api/geocode/route'

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

describe('GET /api/geocode', () => {
  const originalFetch = global.fetch
  const originalPhotonApiUrl = process.env.PHOTON_API_URL

  afterEach(() => {
    global.fetch = originalFetch
    process.env.PHOTON_API_URL = originalPhotonApiUrl
  })

  it('uses configured Photon API URL and skips invalid features', async () => {
    process.env.PHOTON_API_URL = 'https://photon.local/api/'
    const fetchMock = jest.fn(async (...args: Parameters<typeof fetch>) => {
      void args
      return {
        ok: true,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [-46.6333, -23.5505] },
              properties: { name: 'São Paulo', country: 'Brasil', osm_id: 123 },
            },
            {
              geometry: { coordinates: ['invalid', -23.5505] },
              properties: { name: 'Entrada quebrada' },
            },
            {
              properties: { name: 'Sem geometria' },
            },
          ],
        }),
      } as Response
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const response = await GET(new Request('https://app.test/api/geocode?q=Sao%20Paulo'))
    const body = await response.json()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://photon.local/api/?'),
      expect.any(Object)
    )
    expect(body).toEqual([{
      display_name: 'São Paulo, Brasil',
      lat: '-23.5505',
      lon: '-46.6333',
      place_id: 123,
    }])
  })
})
