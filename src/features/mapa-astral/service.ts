import { calculateHoroscope, type HoroscopeResult } from '@/lib/horoscope'
import type { ValidMapaAstralParams } from './query'

type MapaAstralResultState =
  | { ok: true; result: HoroscopeResult }
  | { ok: false; error: string }

export function getMapaAstralResult(params: ValidMapaAstralParams): MapaAstralResultState {
  try {
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

    return { ok: true, result }
  } catch {
    return {
      ok: false,
      error: 'Não foi possível calcular o mapa. Verifique os dados e tente novamente.',
    }
  }
}
