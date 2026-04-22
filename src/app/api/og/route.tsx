import { calculateHoroscope } from '@/lib/horoscope'
import { config } from '@/config'
import crypto from 'crypto'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const runtime = 'nodejs'

const W = 1200
const H = 630
const BOTTOM_H = 54

function verifySignature(params: URLSearchParams): boolean {
  const toSign = new URLSearchParams()
  for (const key of ['data', 'lat', 'lng', 'hora', 'cidade']) {
    const val = params.get(key)
    if (val !== null) toSign.set(key, val)
  }
  const expected = crypto
    .createHmac('sha256', config.ogImageSecret)
    .update(toSign.toString())
    .digest('hex')
  const provided = params.get('sig') ?? ''
  if (provided.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (!verifySignature(searchParams)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const dataStr = searchParams.get('data') ?? ''
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')
  const horaStr = searchParams.get('hora') ?? ''
  const cidade = searchParams.get('cidade') ?? ''

  if (!dataStr) return new Response('Missing data', { status: 400 })
  if (!Number.isFinite(lat) || lat < -90  || lat > 90)  return new Response('Invalid lat', { status: 400 })
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) return new Response('Invalid lng', { status: 400 })

  const [year, month, day] = dataStr.split('-').map(Number)
  const [hour, minute] = horaStr ? horaStr.split(':').map(Number) : [12, 0]

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day))
    return new Response('Invalid date', { status: 400 })
  if (horaStr && (!Number.isFinite(hour) || !Number.isFinite(minute)))
    return new Response('Invalid hora', { status: 400 })

  let result
  try {
    result = calculateHoroscope({
      year, month, day, hour, minute, lat, lng,
      hasTime: !!horaStr,
    })
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const sun = result.positions.find(p => p.key === 'sun')
  const moon = result.positions.find(p => p.key === 'moon')
  const asc = result.ascendant

  let formattedDate = dataStr
  try { formattedDate = format(parseISO(dataStr), 'dd/MM/yyyy', { locale: ptBR }) } catch {}
  const timeLabel = horaStr ? ` · ${horaStr.replace(':', 'h')}` : ''
  const locationLine = [cidade, formattedDate + timeLabel].filter(Boolean).join('  ·  ')

  // woff2 is NOT supported by Satori — must use ttf, otf, or woff
  let fontData: ArrayBuffer | undefined
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gowFXDTOA.woff'
    )
    if (res.ok) fontData = await res.arrayBuffer()
  } catch { /* use system font fallback */ }

  const cards = [
    { label: 'SOL', value: sun?.signPt ?? '—', bg: '#4db8ff' },
    { label: 'LUA', value: moon?.signPt ?? '—', bg: '#e8ff80' },
    ...(asc ? [{ label: 'ASCENDENTE', value: asc.signPt, bg: '#ff99cc' }] : []),
  ]

  const FONT = fontData ? 'SpaceGrotesk' : 'sans-serif'
  const CONTENT_H = H - BOTTOM_H

  try { return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: W, height: H }}>
        {/* Main area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: W,
            height: CONTENT_H,
            background: '#ccff00',
            padding: '48px 64px 40px',
          }}
        >
          {/* Top: badge + emoji */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#000',
                padding: '7px 16px',
              }}
            >
              <span style={{ color: '#ccff00', fontSize: 13, fontWeight: 900, fontFamily: FONT, letterSpacing: '0.18em' }}>
                100% OPEN SOURCE
              </span>
            </div>
            <span style={{ fontSize: 72 }}>🔮</span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 96, fontWeight: 900, fontFamily: FONT, color: '#000', lineHeight: 0.88, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              MAPA
            </span>
            <span style={{ fontSize: 96, fontWeight: 900, fontFamily: FONT, color: '#000', lineHeight: 0.88, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              ASTRAL
            </span>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', gap: 16 }}>
            {cards.map(card => (
              <div
                key={card.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: card.bg,
                  border: '3px solid #000',
                  padding: '16px 20px',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 900, fontFamily: FONT, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {card.label}
                </span>
                <span style={{ fontSize: 30, fontWeight: 900, fontFamily: FONT, color: '#000', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {card.value}
                </span>
              </div>
            ))}
          </div>

          {/* Location */}
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT, color: 'rgba(0,0,0,0.55)' }}>
            {locationLine}
          </span>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: W,
            height: BOTTOM_H,
            background: '#000',
            padding: '0 64px',
          }}
        >
          <span style={{ color: '#ccff00', fontSize: 17, fontWeight: 900, fontFamily: FONT, letterSpacing: '0.04em' }}>
            psicologaemoutradimensao.com.br
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 700, fontFamily: FONT }}>
            Gratuito · Sem cadastro
          </span>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      ...(fontData
        ? { fonts: [{ name: 'SpaceGrotesk', data: fontData, weight: 900, style: 'normal' }] }
        : {}),
    }
  ) } catch (e) {
    console.error('[og] ImageResponse error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
