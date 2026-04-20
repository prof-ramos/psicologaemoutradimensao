'use client'

import type { HoroscopeResult } from '@/lib/horoscope'
import { useEffect, useId, useRef, useState } from 'react'

interface ChartSVGProps {
  data: HoroscopeResult
}

export function ChartSVG({ data }: ChartSVGProps) {
  const rawId   = useId()
  const chartId = rawId.replace(/:/g, 'c')
  const ref     = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!ref.current) return

    const container = ref.current
    const size = container.clientWidth || 500

    import('@astrodraw/astrochart').then(({ Chart }) => {
      if (!container) return
      container.innerHTML = ''

      const chart = new Chart(chartId, size, size, {
        SYMBOL_SCALE: 0.9,
        MARGIN:       60,
      })

      const cusps = data.hasHouses && data.cusps.length === 12
        ? data.cusps
        : [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

      const radix = chart.radix({ planets: data.planets, cusps })

      if (data.hasHouses && data.cusps.length === 12) {
        radix.addPointsOfInterest({
          As: [data.cusps[0]],
          Ic: [data.cusps[3]],
          Ds: [data.cusps[6]],
          Mc: [data.cusps[9]],
        })
      }

      radix.aspects()
      setIsLoading(false)
    })
  }, [data, chartId])

  return (
    <figure className="rounded-[1.9rem] border border-border/10 bg-surface p-5 shadow-[var(--shadow-shadow)] lg:sticky lg:top-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground/52">
            Visualização
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Roda zodiacal
          </h2>
        </div>
        <p className="max-w-[11rem] text-right text-xs leading-5 text-muted-foreground">
          O gráfico concentra o desenho geral do mapa e os principais eixos.
        </p>
      </div>
      <div className="rounded-[1.5rem] border border-border/10 bg-[radial-gradient(circle_at_top,rgba(168,198,240,0.18),transparent_42%),#fdfdfc] p-3">
        <div
          id={chartId}
          ref={ref}
          className="aspect-square w-full overflow-hidden rounded-[1.2rem] bg-white"
          role="img"
          aria-label="Roda zodiacal do mapa natal"
          aria-busy={isLoading}
        >
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Carregando gráfico…
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-4 text-sm leading-6 text-muted-foreground">
        Mapa gerado a partir dos dados informados, com foco na leitura visual rápida da configuração natal.
      </figcaption>
    </figure>
  )
}
