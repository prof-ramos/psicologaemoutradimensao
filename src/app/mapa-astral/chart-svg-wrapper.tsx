'use client'

import type { HoroscopeResult } from '@/lib/horoscope'
import { ChartSVG } from './chart-svg'

// Client boundary to isolate server components from the ChartSVG library
export function ChartSVGWrapper({ data }: { data: HoroscopeResult }) {
  return <ChartSVG data={data} />
}
