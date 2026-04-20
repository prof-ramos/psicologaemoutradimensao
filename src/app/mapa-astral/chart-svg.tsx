'use client'

import { useEffect, useRef, useId } from 'react'
import type { HoroscopeResult } from '@/lib/horoscope'

interface ChartSVGProps {
  data: HoroscopeResult
}

export function ChartSVG({ data }: ChartSVGProps) {
  const rawId   = useId()
  const chartId = rawId.replace(/:/g, 'c')
  const ref     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    import('@astrodraw/astrochart').then(({ Chart }) => {
      if (!ref.current) return
      ref.current.innerHTML = ''

      const chart = new Chart(chartId, 500, 500, {
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
    })
  }, [data, chartId])

  return (
    <div
      id={chartId}
      ref={ref}
      className="border-2 border-border shadow-shadow w-full aspect-square bg-white"
    />
  )
}
