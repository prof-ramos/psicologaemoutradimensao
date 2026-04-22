import type { Metadata } from 'next'
import { Globe } from 'lucide-react'
import {
  buildMapaAstralMetadata,
  createMapaAstralPageState,
  parseMapaAstralParams,
} from '@/features/mapa-astral'
import { ChartForm } from './chart-form'
import { ChartDetails } from './chart-details'
import { ChartSVGWrapper } from './chart-svg-wrapper'

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const parsed = parseMapaAstralParams(await searchParams)
  return buildMapaAstralMetadata(parsed.kind === 'valid' ? parsed.value : undefined)
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
  const pageState = createMapaAstralPageState(params)
  const { calcError, params: parsedParams, result, shareMessages } = pageState

  return (
    <main className="-mx-4 -mt-8 flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b-2 border-border bg-cosmic-blue pt-8 pb-10 md:pt-10 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start border-2 border-border bg-foreground px-3 py-1.5 shadow-shadow">
              <Globe className="h-4 w-4 text-cosmic-blue fill-cosmic-blue" aria-hidden="true" />
              <span className="font-heading text-xs font-black uppercase tracking-widest text-background">
                100% Open Source
              </span>
            </div>
            
            <div className="max-w-3xl space-y-4">
              <h1 className="font-heading text-5xl font-black uppercase leading-[0.9] md:text-6xl lg:text-7xl">
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
                <div className="lg:sticky lg:top-24">
                  <ChartSVGWrapper data={result} />
                </div>
                <ChartDetails
                  data={result}
                  cidade={parsedParams?.cidade ?? ''}
                  dataStr={parsedParams?.data ?? ''}
                  hora={parsedParams?.hora}
                  twitterMessage={shareMessages?.twitterMessage}
                  whatsappMessage={shareMessages?.whatsappMessage}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
