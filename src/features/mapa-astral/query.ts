export interface MapaAstralRawParams {
  data?: string | string[]
  hora?: string | string[]
  lat?: string | string[]
  lng?: string | string[]
  cidade?: string | string[]
}

export interface ValidMapaAstralParams {
  data: string
  hora?: string
  lat: string
  lng: string
  cidade?: string
  year: number
  month: number
  day: number
  hour: number
  minute: number
  latNumber: number
  lngNumber: number
  hasTime: boolean
}

type ParsedMapaAstralParams =
  | { kind: 'empty' }
  | { kind: 'invalid'; error: string }
  | { kind: 'valid'; value: ValidMapaAstralParams }

const DATE_RE = /^\d{4}-\d{1,2}-\d{1,2}$/
const TIME_RE = /^\d{1,2}:\d{1,2}$/
const FLOAT_RE = /^-?\d+(\.\d+)?$/

function normalizeString(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value.find((item) => item.trim()) : value
  const trimmed = raw?.trim()
  return trimmed ? trimmed : undefined
}

export function parseMapaAstralParams(input: MapaAstralRawParams): ParsedMapaAstralParams {
  const data = normalizeString(input.data)
  const hora = normalizeString(input.hora)
  const lat = normalizeString(input.lat)
  const lng = normalizeString(input.lng)
  const cidade = normalizeString(input.cidade)

  const hasRequiredParams = !!(data && lat && lng)
  if (!hasRequiredParams) {
    return { kind: 'empty' }
  }

  if (!DATE_RE.test(data)) return { kind: 'invalid', error: 'Data inválida.' }

  const [year, month, day] = data.split('-').map(Number)
  const parsedDate = new Date(year, month - 1, day)
  if (
    !year ||
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return { kind: 'invalid', error: 'Data inválida.' }
  }

  let hour = 12
  let minute = 0
  if (hora) {
    if (!TIME_RE.test(hora)) return { kind: 'invalid', error: 'Hora inválida.' }
    ;[hour, minute] = hora.split(':').map(Number)
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return { kind: 'invalid', error: 'Hora inválida.' }
    }
  }

  if (!FLOAT_RE.test(lat)) {
    return { kind: 'invalid', error: 'Latitude inválida.' }
  }

  if (!FLOAT_RE.test(lng)) {
    return { kind: 'invalid', error: 'Longitude inválida.' }
  }

  const latNumber = Number(lat)
  const lngNumber = Number(lng)

  if (!Number.isFinite(latNumber) || latNumber < -90 || latNumber > 90) {
    return { kind: 'invalid', error: 'Latitude inválida.' }
  }

  if (!Number.isFinite(lngNumber) || lngNumber < -180 || lngNumber > 180) {
    return { kind: 'invalid', error: 'Longitude inválida.' }
  }

  return {
    kind: 'valid',
    value: {
      data,
      hora,
      lat,
      lng,
      cidade,
      year,
      month,
      day,
      hour,
      minute,
      latNumber,
      lngNumber,
      hasTime: !!hora,
    },
  }
}
