import { siteConfig } from '@/config/site'
import { buildMapaAstralShareMessages } from './share'
import { parseMapaAstralParams, type MapaAstralRawParams, type ValidMapaAstralParams } from './query'
import { getMapaAstralResult } from './service'
import type { HoroscopeResult } from '@/lib/horoscope'

interface MapaAstralPageState {
  hasParams: boolean
  calcError: string | null
  params?: ValidMapaAstralParams
  result?: HoroscopeResult
  shareMessages?: ReturnType<typeof buildMapaAstralShareMessages>
}

export function createMapaAstralPageState(
  rawParams: MapaAstralRawParams,
  baseUrl = siteConfig.baseUrl
): MapaAstralPageState {
  const parsed = parseMapaAstralParams(rawParams)

  if (parsed.kind === 'empty') {
    return { hasParams: false, calcError: null }
  }

  if (parsed.kind === 'invalid') {
    return { hasParams: true, calcError: parsed.error }
  }

  const calculation = getMapaAstralResult(parsed.value)
  if (!calculation.ok) {
    return { hasParams: true, params: parsed.value, calcError: calculation.error }
  }

  return {
    hasParams: true,
    calcError: null,
    params: parsed.value,
    result: calculation.result,
    shareMessages: buildMapaAstralShareMessages({
      result: calculation.result,
      params: parsed.value,
      baseUrl,
    }),
  }
}
