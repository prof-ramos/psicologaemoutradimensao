import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import { parseSeuDiaParams, fetchOnThisDay } from '@/features/seu-dia'
import { DateForm } from './date-form'
import { DayResults } from './day-results'

interface PageProps {
  searchParams: Promise<{ data?: string | string[] }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const parsed = parseSeuDiaParams(await searchParams)
  const title = parsed.kind === 'valid' ? `Seu Dia — ${parsed.value.display}` : 'Seu Dia'
  return {
    title,
    description: 'Descubra o que aconteceu no mundo no dia em que você nasceu — eventos históricos, personalidades e muito mais.',
  }
}

export default async function SeuDiaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const parsed = parseSeuDiaParams(params)

  const result =
    parsed.kind === 'valid'
      ? await fetchOnThisDay(parsed.value.month, parsed.value.day, parsed.value.year)
      : null

  const rawData = Array.isArray(params.data) ? params.data[0] : params.data
  const defaultDate = parsed.kind !== 'empty' ? (rawData ?? '') : ''

  return (
    <main className="-mx-4 -mt-8 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-border bg-vibrant-pink pt-8 pb-10 md:pt-10 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start border-2 border-border bg-foreground px-3 py-1.5 shadow-shadow">
              <Calendar className="h-4 w-4 text-vibrant-pink fill-vibrant-pink" aria-hidden="true" />
              <span className="font-heading text-xs font-black uppercase tracking-widest text-background">
                Wikipedia pt-BR
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-heading text-5xl font-black uppercase leading-[0.9] md:text-6xl lg:text-7xl">
                Seu <br />
                <span className="text-white">Dia</span>
              </h1>
              <p className="max-w-lg font-base text-lg leading-relaxed text-foreground md:text-xl">
                Descubra o que aconteceu no mundo no dia em que você nasceu —
                eventos históricos, personalidades e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Formulário */}
          <section id="configurar" className="scroll-mt-24">
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="font-heading text-2xl font-black uppercase md:text-3xl">
                Data de Nascimento
              </h2>
              <p className="font-base text-muted-foreground">
                Informe sua data de nascimento para ver o que aconteceu naquele dia.
              </p>
            </div>
            <DateForm defaultValue={defaultDate} />
          </section>

          {/* Erro */}
          {parsed.kind === 'invalid' && (
            <div
              role="alert"
              aria-live="assertive"
              className="border-2 border-border bg-electric-orange p-6 shadow-shadow"
            >
              <p className="font-heading text-lg font-black">{parsed.error}</p>
            </div>
          )}

          {/* Resultado */}
          {result && parsed.kind === 'valid' && (
            <DayResults result={result} params={parsed.value} />
          )}
        </div>
      </div>
    </main>
  )
}
