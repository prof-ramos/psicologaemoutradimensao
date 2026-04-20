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

export default async function MapaAstralPage({ searchParams }: PageProps) {
  const params = await searchParams
  const hasParams = !!(params.data && params.lat && params.lng)

  let result = null
  let calcError: string | null = null

  if (hasParams) {
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

  return (
    <div>

      {/* ── Hero ── */}
      <div className="border-b-2 border-border bg-cosmic-blue px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 border-2 border-border bg-foreground self-start px-3 py-1">
            <Globe className="h-3 w-3 text-cosmic-blue fill-cosmic-blue" />
            <span className="font-heading text-xs font-black tracking-widest text-background uppercase">
              100% Open Source
            </span>
          </div>
          <h1 className="font-heading text-5xl font-black uppercase leading-none md:text-7xl">
            Mapa Astral
          </h1>
          <p className="font-base text-base md:text-lg text-foreground/80 max-w-md">
            Calcule seu mapa natal gratuitamente, em português.
            Sem cadastro, sem cookies, sem bullshit.
          </p>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">

        {/* Formulário — pré-populado com params da URL */}
        <ChartForm
          initialData={params.data}
          initialHora={params.hora}
          initialCidade={params.cidade}
          initialLat={params.lat}
          initialLng={params.lng}
        />

        {/* Erro de cálculo */}
        {calcError && (
          <div className="border-2 border-border bg-electric-orange p-4 shadow-shadow">
            <p className="font-heading font-black">{calcError}</p>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
    </div>
  )
}
