'use client'

import type { HoroscopeResult } from '@/lib/horoscope'

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

// Sign glyphs (index 0 = Aries … 11 = Pisces)
const SIGN_GLYPH = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

// Neobrutalist palette: Fire / Earth / Air / Water
const SIGN_FILL = [
  '#ff6600','#e5e5e5','#4db8ff','#ff99cc',
  '#ff6600','#e5e5e5','#4db8ff','#ff99cc',
  '#ff6600','#e5e5e5','#4db8ff','#ff99cc',
]

/** Convert ecliptic degree → SVG x,y.
 *  Convention: 0° Aries at top (12 o'clock), degrees increase clockwise. */
function ecl(deg: number, r: number, cx: number, cy: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** SVG arc path for an annular sector (donut slice). */
function sector(s: number, e: number, ro: number, ri: number, cx: number, cy: number) {
  const os = ecl(s, ro, cx, cy)
  const oe = ecl(e, ro, cx, cy)
  const ie = ecl(e, ri, cx, cy)
  const is_ = ecl(s, ri, cx, cy)
  return [
    `M ${os.x.toFixed(2)} ${os.y.toFixed(2)}`,
    `A ${ro} ${ro} 0 0 1 ${oe.x.toFixed(2)} ${oe.y.toFixed(2)}`,
    `L ${ie.x.toFixed(2)} ${ie.y.toFixed(2)}`,
    `A ${ri} ${ri} 0 0 0 ${is_.x.toFixed(2)} ${is_.y.toFixed(2)}`,
    'Z',
  ].join(' ')
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
  const RP  = 154  // planet orbit radius
  const RH  = 58   // house circle
  const RC  = 22   // center dot

  return (
    <div className="border-2 border-border bg-background shadow-shadow">
      <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto" aria-label="Roda zodiacal">

        {/* White base */}
        <circle cx={cx} cy={cy} r={RO + 3} fill="white" />

        {/* 12 sign sectors */}
        {SIGN_GLYPH.map((glyph, i) => {
          const start = i * 30
          const mid = ecl(start + 15, (RO + RI) / 2, cx, cy)
          return (
            <g key={`s${i}`}>
              <path
                d={sector(start, start + 30, RO, RI, cx, cy)}
                fill={SIGN_FILL[i]}
                stroke="black"
                strokeWidth="1.5"
              />
              <text
                x={mid.x} y={mid.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="16" fontFamily="serif" fill="black"
              >
                {glyph}
              </text>
            </g>
          )
        })}

        {/* Outer ring border */}
        <circle cx={cx} cy={cy} r={RO} fill="none" stroke="black" strokeWidth="2.5" />

        {/* Inner chart area */}
        <circle cx={cx} cy={cy} r={RI} fill="white" stroke="black" strokeWidth="1.5" />

        {/* Degree ticks (every 10°, stronger every 30°) */}
        {Array.from({ length: 36 }, (_, i) => {
          const d   = i * 10
          const len = d % 30 === 0 ? 10 : 5
          const o   = ecl(d, RI, cx, cy)
          const inn = ecl(d, RI - len, cx, cy)
          return (
            <line key={`t${i}`}
              x1={inn.x} y1={inn.y} x2={o.x} y2={o.y}
              stroke="black" strokeWidth={d % 30 === 0 ? 1.5 : 0.75}
            />
          )
        })}

        {/* House cusp lines */}
        {data.hasHouses && data.cusps.map((cusp, i) => {
          const isAngle = i === 0 || i === 3 || i === 6 || i === 9
          const o   = ecl(cusp, RI - 2, cx, cy)
          const inn = ecl(cusp, RH + 4, cx, cy)
          return (
            <line key={`h${i}`}
              x1={inn.x} y1={inn.y} x2={o.x} y2={o.y}
              stroke="black"
              strokeWidth={isAngle ? 2 : 0.75}
              strokeDasharray={isAngle ? undefined : '3,3'}
            />
          )
        })}

        {/* Aspect lines */}
        {data.aspects.map((asp, i) => {
          const pos1 = data.positions.find(p => p.namePt === asp.planet1)
          const pos2 = data.positions.find(p => p.namePt === asp.planet2)
          if (!pos1 || !pos2) return null
          const p1 = ecl(pos1.decimalDegrees, RH + 6, cx, cy)
          const p2 = ecl(pos2.decimalDegrees, RH + 6, cx, cy)
          const isHard = asp.typePt === 'Quadratura' || asp.typePt === 'Oposição'
          return (
            <line key={`a${i}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={isHard ? '#ff6600' : '#4db8ff'}
              strokeWidth="0.75"
              strokeDasharray={isHard ? '4,2' : undefined}
              opacity="0.7"
            />
          )
        })}

        {/* Planet symbols */}
        {data.positions.map((pos) => {
          const pt    = ecl(pos.decimalDegrees, RP, cx, cy)
          const glyph = PLANET_GLYPH[pos.key] ?? pos.key.slice(0, 2).toUpperCase()
          return (
            <g key={`p${pos.key}`}>
              <circle
                cx={pt.x} cy={pt.y} r={13}
                fill="#ccff00" stroke="black" strokeWidth="1.5"
              />
              <text
                x={pt.x} y={pt.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="13" fontFamily="serif" fill="black"
              >
                {glyph}
              </text>
              {pos.isRetrograde && (
                <text
                  x={pt.x + 13} y={pt.y - 9}
                  fontSize="8" fontFamily="serif" fill="#555"
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
