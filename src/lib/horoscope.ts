import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import { PLANET_PT, SIGN_PT, ASPECT_PT, toAstroChartKey } from './horoscope-i18n'

export type PlanetPosition = {
  key: string           // lowercase body key: "sun", "moon", …
  namePt: string        // "Sol", "Lua", …
  signPt: string        // "Áries", "Touro", …
  degreeInSign: number  // 0–29.99 graus dentro do signo
  decimalDegrees: number // 0–359.99 graus na eclíptica
  isRetrograde: boolean
  house: number         // 1–12 (0 quando hasHouses=false)
}

export type AspectInfo = {
  planet1: string  // nome pt-BR
  planet2: string  // nome pt-BR
  typePt: string   // "Conjunção", "Trígono", …
  orb: number      // ex: 2.3
}

export type AnglePosition = {
  signPt: string        // "Áries", "Touro", …
  degree: number        // 0–359.99 graus eclípticos
  degreeInSign: number  // 0–29.99 graus dentro do signo
}

export type HoroscopeResult = {
  /** Formato AstroChart: { Sun: [281], Moon: [268, -0.2], … } */
  planets: Record<string, number[]>
  /** 12 cúspides em graus eclípticos (0–360). Vazio se hasHouses=false */
  cusps: number[]
  positions: PlanetPosition[]
  aspects: AspectInfo[]
  hasHouses: boolean
  /** Ascendente — só presente quando hasHouses=true */
  ascendant?: AnglePosition
  /** Meio do Céu (MC) — só presente quando hasHouses=true */
  midheaven?: AnglePosition
}

export type HoroscopeInput = {
  year: number
  month: number   // 1-indexed: January=1, …, December=12
  day: number
  hour: number    // 0–23 (use 12 se hora desconhecida)
  minute: number  // 0–59
  lat: number
  lng: number
  hasTime: boolean  // false → calcula com hora=12:00 mas esconde casas no output
}

export function calculateHoroscope(input: HoroscopeInput): HoroscopeResult {
  try {
  const origin = new (Origin as any)({
    year:      input.year,
    month:     input.month - 1,   // Origin usa meses 0-indexed
    date:      input.day,
    hour:      input.hour,
    minute:    input.minute,
    latitude:  input.lat,
    longitude: input.lng,
  })

  const horoscope = new (Horoscope as any)({
    origin,
    houseSystem:      'placidus',
    zodiac:           'tropical',
    aspectPoints:     ['bodies'],
    aspectWithPoints: ['bodies'],
    aspectTypes:      ['major'],
    customOrbs: {
      conjunction: 10,
      opposition:  10,
      trine:        8,
      square:       7,
      sextile:      6,
      quincunx:     3,
    },
  })

  // ── Posições planetárias ──────────────────────────────────────────────
  const planets: Record<string, number[]> = {}
  const positions: PlanetPosition[] = []

  for (const body of horoscope.CelestialBodies.all as any[]) {
    const key: string = body.key          // "sun", "moon", …
    const dec: number = body.ChartPosition.Ecliptic.DecimalDegrees
    const isRetro: boolean = !!body.isRetrograde

    planets[toAstroChartKey(key)] = isRetro ? [dec, -0.2] : [dec]

    positions.push({
      key,
      namePt:         PLANET_PT[key]           ?? key,
      signPt:         SIGN_PT[body.Sign.label]  ?? body.Sign.label,
      degreeInSign:   dec % 30,
      decimalDegrees: dec,
      isRetrograde:   isRetro,
      house: input.hasTime ? (body.House?.id ?? 0) : 0,
    })
  }

  // ── Cúspides das casas ────────────────────────────────────────────────
  const cusps: number[] = input.hasTime
    ? (horoscope.Houses as any[]).map(
        (h: any) => h.ChartPosition.StartPosition.Ecliptic.DecimalDegrees
      )
    : []

  // ── Aspectos ──────────────────────────────────────────────────────────
  const aspects: AspectInfo[] = (horoscope.Aspects.all as any[]).map((asp: any) => ({
    planet1: PLANET_PT[asp.point1Key] ?? asp.point1Label,
    planet2: PLANET_PT[asp.point2Key] ?? asp.point2Label,
    typePt:  ASPECT_PT[asp.aspectKey] ?? asp.label,
    orb:     Math.round(asp.orb * 10) / 10,
  }))

  // ── Ascendente e MC ───────────────────────────────────────────────────
  let ascendant: HoroscopeResult['ascendant']
  let midheaven: HoroscopeResult['midheaven']

  if (input.hasTime) {
    const asc = horoscope.Ascendant as any
    const mc  = horoscope.Midheaven as any

    if (asc) {
      const deg = asc.ChartPosition.Ecliptic.DecimalDegrees as number
      ascendant = {
        signPt:       SIGN_PT[asc.Sign.label] ?? asc.Sign.label,
        degree:       deg,
        degreeInSign: deg % 30,
      }
    }

    if (mc) {
      const deg = mc.ChartPosition.Ecliptic.DecimalDegrees as number
      midheaven = {
        signPt:       SIGN_PT[mc.Sign.label] ?? mc.Sign.label,
        degree:       deg,
        degreeInSign: deg % 30,
      }
    }
  }

  return { planets, cusps, positions, aspects, hasHouses: input.hasTime, ascendant, midheaven }
  } catch (err) {
    console.error('calculateHoroscope error:', err)
    throw new Error(
      `Falha no cálculo do mapa astral: ${err instanceof Error ? err.message : 'erro desconhecido'}`
    )
  }
}
