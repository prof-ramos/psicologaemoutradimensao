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
  const parsedDate = new Date(year, month - 1, day)
  if (
    !year ||
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return 'Data inválida.'
  }

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
    <main className="-mx-4 -mt-8 flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b-2 border-border bg-cosmic-blue pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start border-2 border-border bg-foreground px-3 py-1.5 shadow-shadow">
              <Globe className="h-4 w-4 text-cosmic-blue fill-cosmic-blue" aria-hidden="true" />
              <span className="font-heading text-xs font-black uppercase tracking-widest text-background">
                100% Open Source
              </span>
            </div>
            
            <div className="max-w-3xl space-y-4">
              <h1 className="font-heading text-6xl font-black uppercase leading-[0.9] md:text-8xl lg:text-9xl">
                Mapa <br />
                <span className="text-white">Astral</span>
              </h1>
              <p className="max-w-lg font-base text-lg leading-relaxed text-foreground md:text-xl">
                Descubra a configuração do céu no momento exato do seu nascimento. 
                Gratuito, em português e sem bullshit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conteúdo Principal ── */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="flex flex-col gap-16 md:gap-24">
          
          {/* Seção do Formulário */}
          <section id="configurar" className="scroll-mt-24">
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="font-heading text-2xl font-black uppercase md:text-3xl">
                Dados de Nascimento
              </h2>
              <p className="font-base text-muted-foreground">
                Preencha os dados abaixo para calcular seu mapa natal completo.
              </p>
            </div>
            <ChartForm
              initialDate={params.data}
              initialHora={params.hora}
              initialCidade={params.cidade}
              initialLat={params.lat}
              initialLng={params.lng}
            />
          </section>

          {/* Erro de cálculo */}
          {calcError && (
            <div role="alert" aria-live="assertive" className="border-2 border-border bg-electric-orange p-6 shadow-shadow">
              <p className="font-heading text-lg font-black">{calcError}</p>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <section id="resultado" className="scroll-mt-24 space-y-12">
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-3xl font-black uppercase md:text-5xl">
                  Seu Céu Natal
                </h2>
                <div className="h-1.5 w-24 bg-main border-2 border-border" />
              </div>
              
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
                <div className="sticky top-24">
                  <ChartSVGWrapper data={result} />
                </div>
                <ChartDetails
                  data={result}
                  cidade={params.cidade ?? ''}
                  dataStr={params.data!}
                  hora={params.hora}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
