'use client'

import dynamic from 'next/dynamic'
import type { HoroscopeResult } from '@/lib/horoscope'

const ChartSVGLazy = dynamic(
  () => import('./chart-svg').then(m => ({ default: m.ChartSVG })),
  {
    ssr: false,
    loading: () => (
      <div className="border-2 border-border bg-background shadow-shadow flex items-center justify-center" style={{ minHeight: 320 }}>
        <span className="font-heading text-sm font-bold animate-pulse">Carregando mapa...</span>
      </div>
    ),
  }
)

export function ChartSVGWrapper({ data }: { data: HoroscopeResult }) {
  return <ChartSVGLazy data={data} />
}
