import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

function getAssetSrc(file: string, mime: string): string {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', file))
    return `data:${mime};base64,${buf.toString('base64')}`
  } catch {
    return ''
  }
}

const W = 1200
const H = 630
const BOTTOM_H = 54

export async function GET() {
  const mysticSrc = getAssetSrc('mystic.png', 'image/png')
  let fontData: ArrayBuffer | undefined
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gowFXDTOA.woff'
    )
    if (res.ok) fontData = await res.arrayBuffer()
  } catch { /* use system font fallback */ }

  const FONT = fontData ? 'SpaceGrotesk' : 'sans-serif'
  const CONTENT_H = H - BOTTOM_H

  try {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: W, height: H }}>
          {/* Main area */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: W,
              height: CONTENT_H,
              background: '#ccff00',
              overflow: 'hidden',
            }}
          >
            {/* Sparkles em diagonal — grandes âncora + pequenos satélite */}
            {[
              { top: 22,  left: 820, size: 50, opacity: 0.70 },
              { top: 120, left: 760, size: 20, opacity: 0.40 },
              { top: 210, left: 870, size: 18, opacity: 0.30 },
              { top: 320, left: 790, size: 48, opacity: 0.65 },
              { top: 440, left: 840, size: 22, opacity: 0.42 },
            ].map((s, i) => (
              <svg key={i} viewBox="0 0 64 64" width={s.size} height={s.size}
                style={{ position: 'absolute', top: s.top, left: s.left, opacity: s.opacity, display: 'flex' }}>
                <path d="m28 28 12 10.59 12-10.59-10.59 12 10.59 12-12-10.59-12 10.59 10.59-12z" fill="#000"/>
                <path d="m40 17 1 22 22 1-22 1-1 22-1-22-22-1 22-1z" fill="#000"/>
                <path d="m11 11 7 5.59 7-5.59-5.59 7 5.59 7-7-5.59-7 5.59 5.59-7z" fill="#000"/>
                <path d="m18 1 1 16 16 1-16 1-1 16-1-16-16-1 16-1z" fill="#000"/>
              </svg>
            ))}

            {/* Coluna esquerda — texto */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              padding: '44px 48px 40px 56px',
            }}>
              {/* Badge */}
              <div style={{ display: 'flex' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#000',
                  padding: '7px 16px',
                }}>
                  <span style={{ color: '#ccff00', fontSize: 12, fontWeight: 900, fontFamily: FONT, letterSpacing: '0.2em' }}>
                    ASTROLOGIA · HUMOR · INTERNET
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 98, fontWeight: 900, fontFamily: FONT, color: '#000', lineHeight: 0.86, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
                  PSICÓLOGA
                </span>
                <span style={{ fontSize: 98, fontWeight: 900, fontFamily: FONT, color: '#000', lineHeight: 0.86, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
                  EM OUTRA
                </span>
                <span style={{ fontSize: 98, fontWeight: 900, fontFamily: FONT, color: '#000', lineHeight: 0.86, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
                  DIMENSÃO
                </span>
              </div>

              {/* Tagline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT, color: 'rgba(0,0,0,0.65)' }}>
                  Astrologia pop · Humor ácido · Caos emocional.
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: FONT, color: 'rgba(0,0,0,0.42)', letterSpacing: '0.04em' }}>
                  MAPA ASTRAL GRATUITO · SEM CADASTRO
                </span>
              </div>
            </div>

            {/* Coluna direita — fundo levemente mais escuro + bola grande */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 320,
              flexShrink: 0,
              background: '#b8e800',
              alignSelf: 'stretch',
            }}>
              {mysticSrc
                ? <img src={mysticSrc} width={260} height={260} style={{ objectFit: 'contain' }} />
                : <span style={{ fontSize: 140 }}>🔮</span>
              }
            </div>
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
              padding: '0 56px',
            }}
          >
            <span style={{ color: '#ccff00', fontSize: 17, fontWeight: 900, fontFamily: FONT, letterSpacing: '0.04em' }}>
              psicologaemoutradimensao.com.br
            </span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, fontWeight: 700, fontFamily: FONT, letterSpacing: '0.06em' }}>
              @Gayaliz_
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
    )
  } catch (e) {
    console.error('[og/site] ImageResponse error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
