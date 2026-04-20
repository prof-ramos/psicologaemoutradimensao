'use client'

import dynamic from 'next/dynamic'
import type { HoroscopeResult } from '@/lib/horoscope'

const ChartSVGLazy = dynamic(
  () => import('./chart-svg').then(m => ({ default: m.ChartSVG })),
  { ssr: false }
)

export function ChartSVGWrapper({ data }: { data: HoroscopeResult }) {
  return <ChartSVGLazy data={data} />
}
