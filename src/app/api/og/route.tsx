import {
  getMapaAstralResult,
  parseMapaAstralParams,
  verifyMapaAstralOgSignature,
} from '@/features/mapa-astral'
import { getOgFontOptions, ogAssets } from '@/features/og/assets'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const runtime = 'nodejs'

const W = 1200
const H = 630
const BOTTOM_H = 54

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (!verifyMapaAstralOgSignature(searchParams)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const parsed = parseMapaAstralParams({
    data: searchParams.get('data') ?? undefined,
    hora: searchParams.get('hora') ?? undefined,
    lat: searchParams.get('lat') ?? undefined,
    lng: searchParams.get('lng') ?? undefined,
    cidade: searchParams.get('cidade') ?? undefined,
  })

  if (parsed.kind === 'empty') {
    return new Response('Missing data', { status: 400 })
  }
  if (parsed.kind === 'invalid') {
    return new Response(parsed.error, { status: 400 })
  }

  const calculation = getMapaAstralResult(parsed.value)
  if (!calculation.ok) return new Response('Bad request', { status: 400 })

  const { result } = calculation

  const sun = result.positions.find(p => p.key === 'sun')
  const moon = result.positions.find(p => p.key === 'moon')
  const asc = result.ascendant

  let formattedDate = parsed.value.data
  try { formattedDate = format(parseISO(parsed.value.data), 'dd/MM/yyyy', { locale: ptBR }) } catch {}
  const timeLabel = parsed.value.hora ? ` · ${parsed.value.hora.replace(':', 'h')}` : ''
  const locationLine = [parsed.value.cidade, formattedDate + timeLabel].filter(Boolean).join('  ·  ')

  const cards = [
    { label: 'SOL', value: sun?.signPt ?? '—', bg: '#4db8ff' },
    { label: 'LUA', value: moon?.signPt ?? '—', bg: '#e8ff80' },
    ...(asc ? [{ label: 'ASCENDENTE', value: asc.signPt, bg: '#ff99cc' }] : []),
  ]

  const FONT = ogAssets.fontName
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
      ...getOgFontOptions(),
    }
  ) } catch (e) {
    console.error('[og] ImageResponse error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
