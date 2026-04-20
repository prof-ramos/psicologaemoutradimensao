'use client'

import type { HoroscopeResult } from '@/lib/horoscope'

// Sign names (index 0 = Aries … 11 = Pisces) → /signs/<name>.svg
const SIGN_NAMES = [
  'aries','taurus','gemini','cancer',
  'leo','virgo','libra','scorpio',
  'sagittarius','capricorn','aquarius','pisces',
]

// Unicode symbols for planets (body.key → glyph)
const PLANET_GLYPH: Record<string, string> = {
  sun:       '☉',
  moon:      '☽',
  mercury:   '☿',
  venus:     '♀',
  mars:      '♂',
  jupiter:   '♃',
  saturn:    '♄',
  uranus:    '♅',
  neptune:   '♆',
  pluto:     '♇',
  chiron:    '⚷',
  northnode: '☊',
  southnode: '☋',
  lilith:    '⚸',
}

// Neobrutalist palette: Fire / Earth / Air / Water
const SIGN_FILL = [
  '#ff6600','#e5e5e5','#4db8ff','#ff99cc',
  '#ff6600','#e5e5e5','#4db8ff','#ff99cc',
  '#ff6600','#e5e5e5','#4db8ff','#ff99cc',
]

// Aspect colors by type
const ASPECT_COLOR: Record<string, string> = {
  'Conjunção':  '#22c55e',
  'Oposição':   '#ef4444',
  'Quadratura': '#ff6600',
  'Trígono':    '#4db8ff',
  'Sextil':     '#a78bfa',
  'Quincúncio': '#f59e0b',
}

/** Convert ecliptic degree → SVG x,y.
 *  Convention: 0° Aries at top (12 o'clock), degrees increase clockwise. */
function ecl(deg: number, r: number, cx: number, cy: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** SVG arc path for an annular sector (donut slice). */
function sector(s: number, e: number, ro: number, ri: number, cx: number, cy: number) {
  const os  = ecl(s, ro, cx, cy)
  const oe  = ecl(e, ro, cx, cy)
  const ie  = ecl(e, ri, cx, cy)
  const is_ = ecl(s, ri, cx, cy)
  return [
    `M ${os.x.toFixed(1)} ${os.y.toFixed(1)}`,
    `A ${ro} ${ro} 0 0 1 ${oe.x.toFixed(1)} ${oe.y.toFixed(1)}`,
    `L ${ie.x.toFixed(1)} ${ie.y.toFixed(1)}`,
    `A ${ri} ${ri} 0 0 0 ${is_.x.toFixed(1)} ${is_.y.toFixed(1)}`,
    'Z',
  ].join(' ')
}

/** Spread planets at similar degrees so they don't overlap. */
function spreadPlanets(
  positions: HoroscopeResult['positions'],
  baseR: number,
  step: number,
  minGap: number,
): Array<{ key: string; r: number; deg: number }> {
  // sort by ecliptic degree
  const sorted = [...positions].sort((a, b) => a.decimalDegrees - b.decimalDegrees)
  const result: Array<{ key: string; r: number; deg: number }> = []

  for (const pos of sorted) {
    // find nearby already-placed planets (within minGap degrees)
    const nearby = result.filter(
      (p) => Math.abs(p.deg - pos.decimalDegrees) < minGap || Math.abs(p.deg - pos.decimalDegrees) > 360 - minGap
    )
    const usedR = new Set(nearby.map((p) => p.r))
    let r = baseR
    while (usedR.has(r)) r -= step
    result.push({ key: pos.key, r, deg: pos.decimalDegrees })
  }

  return result
}

interface ChartSVGProps {
  data: HoroscopeResult
}

export function ChartSVG({ data }: ChartSVGProps) {
  const S  = 500
  const cx = S / 2
  const cy = S / 2

  const RO  = 228  // sign ring outer
  const RI  = 186  // sign ring inner / planet area outer
  const RP  = 158  // planet orbit radius (base)
  const RH  = 60   // house circle
  const RC  = 20   // center dot

  // Pre-compute degree ticks as static array (avoids floating-point hydration mismatch)
  const ticks = [0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,
                 180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350]

  // Spread planets
  const spread = spreadPlanets(data.positions, RP, 22, 18)

  return (
    <div className="border-2 border-border bg-background shadow-shadow">
      <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto" aria-label="Roda zodiacal">

        {/* White base */}
        <circle cx={cx} cy={cy} r={RO + 3} fill="white" />

        {/* 12 sign sectors */}
        {SIGN_NAMES.map((name, i) => {
          const start = i * 30
          const mid   = ecl(start + 15, (RO + RI) / 2, cx, cy)
          const imgSize = 22
          return (
            <g key={`s${i}`}>
              <path
                d={sector(start, start + 30, RO, RI, cx, cy)}
                fill={SIGN_FILL[i]}
                stroke="black"
                strokeWidth="1.5"
              />
              <image
                href={`/signs/${name}.svg`}
                x={mid.x - imgSize / 2}
                y={mid.y - imgSize / 2}
                width={imgSize}
                height={imgSize}
              />
            </g>
          )
        })}

        {/* Outer ring border */}
        <circle cx={cx} cy={cy} r={RO} fill="none" stroke="black" strokeWidth="2.5" />

        {/* Inner chart area */}
        <circle cx={cx} cy={cy} r={RI} fill="white" stroke="black" strokeWidth="1.5" />

        {/* Degree ticks (every 10°, stronger every 30°) */}
        {ticks.map((d) => {
          const len = d % 30 === 0 ? 10 : 5
          const o   = ecl(d, RI, cx, cy)
          const inn = ecl(d, RI - len, cx, cy)
          return (
            <line key={`t${d}`}
              x1={o.x.toFixed(1)} y1={o.y.toFixed(1)}
              x2={inn.x.toFixed(1)} y2={inn.y.toFixed(1)}
              stroke="black" strokeWidth={d % 30 === 0 ? 1.5 : 0.75}
            />
          )
        })}

        {/* House cusp lines + house numbers */}
        {data.hasHouses && data.cusps.map((cusp, i) => {
          const isAngle = i === 0 || i === 3 || i === 6 || i === 9
          const o    = ecl(cusp, RI - 2, cx, cy)
          const inn  = ecl(cusp, RH + 4, cx, cy)
          // House number label: midpoint between this cusp and next
          const nextCusp = data.cusps[(i + 1) % 12]
          let midDeg = (cusp + nextCusp) / 2
          if (nextCusp < cusp) midDeg = ((cusp + nextCusp + 360) / 2) % 360
          const numPt = ecl(midDeg, RH + 20, cx, cy)
          return (
            <g key={`h${i}`}>
              <line
                x1={inn.x.toFixed(1)} y1={inn.y.toFixed(1)}
                x2={o.x.toFixed(1)} y2={o.y.toFixed(1)}
                stroke="black"
                strokeWidth={isAngle ? 2 : 0.75}
                strokeDasharray={isAngle ? undefined : '3,3'}
              />
              <text
                x={numPt.x.toFixed(1)} y={numPt.y.toFixed(1)}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="9" fontFamily="sans-serif" fill="#555" fontWeight="600"
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* ASC / MC angle markers */}
        {data.hasHouses && data.ascendant && (() => {
          const pt = ecl(data.ascendant.degree, RI - 6, cx, cy)
          return (
            <text key="asc-label"
              x={pt.x.toFixed(1)} y={pt.y.toFixed(1)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fontFamily="sans-serif" fontWeight="800" fill="#4db8ff"
            >
              ASC
            </text>
          )
        })()}
        {data.hasHouses && data.midheaven && (() => {
          const pt = ecl(data.midheaven.degree, RI - 6, cx, cy)
          return (
            <text key="mc-label"
              x={pt.x.toFixed(1)} y={pt.y.toFixed(1)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fontFamily="sans-serif" fontWeight="800" fill="#ff99cc"
            >
              MC
            </text>
          )
        })()}

        {/* Aspect lines */}
        {data.aspects.map((asp, i) => {
          const pos1 = data.positions.find(p => p.namePt === asp.planet1)
          const pos2 = data.positions.find(p => p.namePt === asp.planet2)
          if (!pos1 || !pos2) return null
          const p1 = ecl(pos1.decimalDegrees, RH + 6, cx, cy)
          const p2 = ecl(pos2.decimalDegrees, RH + 6, cx, cy)
          const color = ASPECT_COLOR[asp.typePt] ?? '#aaa'
          const isHard = asp.typePt === 'Quadratura' || asp.typePt === 'Oposição'
          return (
            <line key={`a${i}`}
              x1={p1.x.toFixed(1)} y1={p1.y.toFixed(1)}
              x2={p2.x.toFixed(1)} y2={p2.y.toFixed(1)}
              stroke={color}
              strokeWidth="0.8"
              strokeDasharray={isHard ? '4,2' : undefined}
              opacity="0.75"
            />
          )
        })}

        {/* Planet symbols */}
        {spread.map(({ key, r, deg }) => {
          const pos   = data.positions.find(p => p.key === key)!
          const pt    = ecl(deg, r, cx, cy)
          const glyph = PLANET_GLYPH[key] ?? key.slice(0, 2).toUpperCase()
          return (
            <g key={`p${key}`}>
              <circle
                cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r={13}
                fill="#ccff00" stroke="black" strokeWidth="1.5"
              />
              <text
                x={pt.x.toFixed(1)} y={pt.y.toFixed(1)}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="13"
                fontFamily="'Segoe UI Symbol','Apple Symbols','FreeMono',serif"
                fill="black"
                style={{ unicodeBidi: 'plaintext' } as React.CSSProperties}
              >
                {glyph}
              </text>
              {pos.isRetrograde && (
                <text
                  x={(pt.x + 13).toFixed(1)} y={(pt.y - 9).toFixed(1)}
                  fontSize="8" fontFamily="sans-serif" fill="#555"
                >
                  ℞
                </text>
              )}
            </g>
          )
        })}

        {/* House circle */}
        <circle cx={cx} cy={cy} r={RH} fill="white" stroke="black" strokeWidth="1.5" />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={RC} fill="black" />
        <text
          x={cx} y={cy}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="14" fill="#ccff00" fontFamily="monospace" fontWeight="bold"
        >
          ★
        </text>

      </svg>
    </div>
  )
}
