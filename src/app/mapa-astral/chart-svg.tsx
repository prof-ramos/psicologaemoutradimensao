'use client'

import type { HoroscopeResult } from '@/lib/horoscope'
import { useEffect, useId, useRef, useState } from 'react'

interface ChartSVGProps {
  data: HoroscopeResult
}

export function ChartSVG({ data }: ChartSVGProps) {
  const rawId   = useId()
  const chartId = rawId.replace(/:/g, 'c')
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let cancelled = false
    const size = container.clientWidth || 500
    const hasFullHouses = data.hasHouses && data.cusps.length === 12
    setIsLoading(true)

    import('@astrodraw/astrochart').then(({ Chart }) => {
      if (cancelled || !container.isConnected) return
      container.innerHTML = ''

      const chart = new Chart(chartId, size, size, {
        SYMBOL_SCALE: 0.9,
        MARGIN:       60,
      })

      const cusps = hasFullHouses
        ? data.cusps
        : [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

      const radix = chart.radix({ planets: data.planets, cusps })

      if (hasFullHouses) {
        radix.addPointsOfInterest({
          As: [data.cusps[0]],
          Ic: [data.cusps[3]],
          Ds: [data.cusps[6]],
          Mc: [data.cusps[9]],
        })
      }

      radix.aspects()

      if (!cancelled) {
        setIsLoading(false)
      }
    }).catch((err) => {
      console.error('astrochart import error:', err)
      if (!cancelled) {
        container.textContent = 'Não foi possível carregar o gráfico.'
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
      if (container.isConnected) {
        container.replaceChildren()
      }
    }
  }, [data, chartId])

  return (
    <figure>
      <div className="border-2 border-border shadow-shadow w-full aspect-square bg-white">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-[1.2rem] bg-white"
          role="img"
          aria-label="Roda zodiacal do mapa natal"
          aria-busy={isLoading}
        >
          <div id={chartId} ref={mountRef} className="h-full w-full" />
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              Carregando gráfico…
            </div>
          )}
        </div>
      </div>
      <figcaption className="sr-only">Roda zodiacal do mapa natal</figcaption>
    </figure>
  )
}
