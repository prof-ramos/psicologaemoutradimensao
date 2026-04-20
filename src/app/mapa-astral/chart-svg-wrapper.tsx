'use client'

import type { HoroscopeResult } from '@/lib/horoscope'
import { ChartSVG } from './chart-svg'

export function ChartSVGWrapper({ data }: { data: HoroscopeResult }) {
  return <ChartSVG data={data} />
}
