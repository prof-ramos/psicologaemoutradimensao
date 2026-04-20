'use client'

import { useEffect, useRef, useState } from 'react'
import type { HoroscopeResult } from '@/lib/horoscope'

interface ChartSVGProps {
  data: HoroscopeResult
}

export function ChartSVG({ data }: ChartSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const chartId = 'mapa-astral-canvas'

  useEffect(() => {
    if (!containerRef.current) return
    setError(null)

    // Limpar renderização anterior
    containerRef.current.innerHTML = ''
    containerRef.current.id = chartId

    import('astrochart')
      .then(() => {
        const astrology = (window as any).astrology
        if (!astrology) {
          setError('Não foi possível carregar o renderizador do mapa.')
          return
        }

        const size = Math.min(containerRef.current!.offsetWidth || 560, 560)

        const chart = new astrology.Chart(chartId, size, size, {
          MARGIN:           50,
          SYMBOL_SCALE:     0.9,
          COLOR_BACKGROUND: '#ffffff',
          POINTS_COLOR:     '#000000',
          SIGNS_COLOR:      '#000000',
          CIRCLE_COLOR:     '#333333',
          LINE_COLOR:       '#333333',
        })

        const radix = chart.radix({
          planets: data.planets,
          cusps:   data.cusps.length === 12 ? data.cusps : undefined,
        })

        if (data.hasHouses && data.cusps.length === 12) {
          radix.addPointsOfInterest({
            As: [data.cusps[0]],
            Ic: [data.cusps[3]],
            Ds: [data.cusps[6]],
            Mc: [data.cusps[9]],
          })
        }

        radix.aspects()
      })
      .catch(() => setError('Erro ao carregar o gráfico.'))
  }, [data])

  if (error) {
    return (
      <div className="border-2 border-border bg-electric-orange p-4">
        <p className="font-heading font-bold">{error}</p>
      </div>
    )
  }

  return (
    <div className="border-2 border-border bg-background shadow-shadow">
      <div ref={containerRef} className="w-full" />
    </div>
  )
}
