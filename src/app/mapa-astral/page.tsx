import type { Metadata } from 'next'
import { Globe } from 'lucide-react'
import { calculateHoroscope } from '@/lib/horoscope'
import { ChartForm } from './chart-form'
import { ChartDetails } from './chart-details'
import { ChartSVGWrapper } from './chart-svg-wrapper'

export const metadata: Metadata = {
  title: 'Mapa Astral',
  description: 'Calcule seu mapa natal gratuitamente — 100% open source, em português.',
}

interface PageProps {
  searchParams: Promise<{
    data?:   string   // "1990-03-15"
    hora?:   string   // "14:30"
    lat?:    string   // "-23.55"
    lng?:    string   // "-46.63"
    cidade?: string   // "São Paulo"
  }>
}

const DATE_RE = /^\d{4}-\d{1,2}-\d{1,2}$/
const TIME_RE = /^\d{1,2}:\d{1,2}$/

function validateParams(params: {
  data?: string; hora?: string; lat?: string; lng?: string
}): string | null {
  if (!params.data || !DATE_RE.test(params.data)) return 'Data inválida.'
  const [year, month, day] = params.data.split('-').map(Number)
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return 'Data inválida.'

  if (params.hora) {
    if (!TIME_RE.test(params.hora)) return 'Hora inválida.'
    const [hour, minute] = params.hora.split(':').map(Number)
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return 'Hora inválida.'
  }

  const lat = parseFloat(params.lat ?? '')
  const lng = parseFloat(params.lng ?? '')
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return 'Latitude inválida.'
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) return 'Longitude inválida.'

  return null
}

export default async function MapaAstralPage({ searchParams }: PageProps) {
  const params = await searchParams
  const hasParams = !!(params.data && params.lat && params.lng)

  let result = null
  let calcError: string | null = null

  if (hasParams) {
    const validationError = validateParams(params)
    if (validationError) {
      calcError = validationError
    } else {
      try {
        const [year, month, day] = params.data!.split('-').map(Number)
        const [hour, minute] = params.hora
          ? params.hora.split(':').map(Number)
          : [12, 0]

        result = calculateHoroscope({
          year, month, day, hour, minute,
          lat: parseFloat(params.lat!),
          lng: parseFloat(params.lng!),
          hasTime: !!params.hora,
        })
      } catch {
        calcError = 'Não foi possível calcular o mapa. Verifique os dados e tente novamente.'
      }
    }
  }

  return (
    <div className="bg-background">
      <section className="border-b border-border/10 bg-[radial-gradient(circle_at_top_left,rgba(168,198,240,0.5),transparent_38%),linear-gradient(180deg,#eef1ea_0%,#f3f4ef_100%)] px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border/10 bg-surface/90 px-3 py-1.5 shadow-[var(--shadow-soft)]">
            <Globe className="h-3.5 w-3.5 text-foreground/70" aria-hidden="true" />
            <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground/72">
              100% Open Source
            </span>
          </div>
          <h1 className="max-w-3xl text-balance font-heading text-4xl font-bold uppercase leading-[0.94] tracking-[-0.05em] md:text-6xl">
            Mapa Astral
          </h1>
          <p className="max-w-2xl text-pretty font-base text-base leading-7 text-foreground/72 md:text-lg">
            Calcule seu mapa natal gratuitamente, em português.
            Sem cadastro, sem cookies, sem bullshit.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:gap-10">
        <ChartForm
          initialDate={params.data}
          initialHora={params.hora}
          initialCidade={params.cidade}
          initialLat={params.lat}
          initialLng={params.lng}
        />

        {calcError && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-3xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-[var(--shadow-soft)]"
          >
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.08em] text-amber-900">
              {calcError}
            </p>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-start xl:gap-8">
            <ChartSVGWrapper data={result} />
            <ChartDetails
              data={result}
              cidade={params.cidade ?? ''}
              dataStr={params.data!}
              hora={params.hora}
            />
          </div>
        )}
        </div>
      </section>
    </div>
  )
}
