import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { HoroscopeResult } from '@/lib/horoscope'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageCircle, X } from 'lucide-react'

const ASPECT_VARIANTS = ['default', 'blue', 'pink', 'orange'] as const

interface ChartDetailsProps {
  data: HoroscopeResult
  cidade: string
  dataStr: string   // "1990-03-15"
  hora?: string     // "14:30" ou undefined
  twitterMessage?: string
  whatsappMessage?: string
}

export function ChartDetails({ data, cidade, dataStr, hora, twitterMessage, whatsappMessage }: ChartDetailsProps) {
  let formattedDate = '—'
  try {
    formattedDate = format(parseISO(dataStr), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    // keep default '—'
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Resumo Card */}
      <div className="border-2 border-border bg-main p-6 shadow-shadow">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <p className="font-heading text-xs font-black uppercase tracking-widest opacity-70">
              Dados do Nascimento
            </p>
            <h3 className="font-heading text-xl font-black uppercase leading-tight md:text-2xl">
              {cidade || 'Local não informado'}
            </h3>
            <p className="font-base text-sm font-bold md:text-base">
              {formattedDate} {hora ? ` às ${hora}` : ''}
            </p>
          </div>
          
          {!data.hasHouses && (
            <div className="border-2 border-border bg-white/50 p-3">
              <p className="font-base text-xs font-bold leading-tight">
                Nota: Sem horário de nascimento, as Casas e o Ascendente não foram calculados. 
                Os planetas estão em suas posições reais.
              </p>
            </div>
          )}

          {data.hasHouses && (data.ascendant || data.midheaven) && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {data.ascendant && (
                <div className="relative overflow-hidden border-2 border-border bg-cosmic-blue p-4 shadow-shadow">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -bottom-2 font-heading text-8xl font-black leading-none text-black/10 select-none"
                  >
                    {Math.floor(data.ascendant.degreeInSign)}°
                  </span>
                  <p className="font-heading text-[9px] font-black uppercase tracking-[0.18em] text-black/50">
                    Ascendente
                  </p>
                  <p className="font-heading text-xl font-black uppercase leading-tight mt-1">
                    {data.ascendant.signPt}
                  </p>
                  <p className="font-base text-xs font-bold text-black/60 mt-0.5">
                    {Math.floor(data.ascendant.degreeInSign)}° no signo
                  </p>
                </div>
              )}
              {data.midheaven && (
                <div className="relative overflow-hidden border-2 border-border bg-vibrant-pink p-4 shadow-shadow">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -bottom-2 font-heading text-8xl font-black leading-none text-black/10 select-none"
                  >
                    {Math.floor(data.midheaven.degreeInSign)}°
                  </span>
                  <p className="font-heading text-[9px] font-black uppercase tracking-[0.18em] text-black/50">
                    Meio do Céu
                  </p>
                  <p className="font-heading text-xl font-black uppercase leading-tight mt-1">
                    {data.midheaven.signPt}
                  </p>
                  <p className="font-base text-xs font-bold text-black/60 mt-0.5">
                    {Math.floor(data.midheaven.degreeInSign)}° no signo
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compartilhar */}
      {(twitterMessage || whatsappMessage) && (
        <div className="flex flex-wrap gap-3">
          {twitterMessage && (
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-3 text-xs rounded-base font-heading font-bold border-2 border-border bg-background text-foreground shadow-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
            >
              <X className="h-3.5 w-3.5" />
              Twitter
            </a>
          )}
          {whatsappMessage && (
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-3 text-xs rounded-base font-heading font-bold border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          )}
        </div>
      )}

      {/* Tabela de Posições */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-black uppercase">Posições</h2>
          <div className="h-0.5 flex-1 bg-border" />
        </div>
        
        <div className="overflow-x-auto border-2 border-border bg-background shadow-shadow">
          <table className="w-full min-w-[340px] font-base text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-secondary-background">
                <th scope="col" className="px-4 py-3 text-left font-heading text-xs font-black uppercase tracking-widest">
                  Astro
                </th>
                <th scope="col" className="px-4 py-3 text-left font-heading text-xs font-black uppercase tracking-widest">
                  Signo
                </th>
                <th scope="col" className="px-4 py-3 text-left font-heading text-xs font-black uppercase tracking-widest">
                  Grau
                </th>
                {data.hasHouses && (
                  <th scope="col" className="px-4 py-3 text-left font-heading text-xs font-black uppercase tracking-widest">
                    Casa
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {data.positions.map((pos) => (
                <tr key={pos.key} className="hover:bg-main/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{pos.namePt}</span>
                      {pos.isRetrograde && (
                        <span 
                          className="inline-flex h-4 w-4 items-center justify-center border border-border bg-electric-orange text-[10px] font-black text-white" 
                          title="Retrógrado"
                        >
                          R
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{pos.signPt}</td>
                  <td className="px-4 py-3 tabular-nums">{Math.floor(pos.degreeInSign)}°</td>
                  {data.hasHouses && (
                    <td className="px-4 py-3 font-bold">{pos.house}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aspectos */}
      {(data.aspects?.length ?? 0) > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-black uppercase">Aspectos</h2>
            <div className="h-0.5 flex-1 bg-border" />
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {data.aspects.map((asp, i) => (
              <Badge
                key={`${asp.planet1}-${asp.typePt}-${asp.planet2}`}
                variant={ASPECT_VARIANTS[i % ASPECT_VARIANTS.length]}
                className="px-3 py-1.5 text-xs shadow-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-default"
              >
                <span className="opacity-80">{asp.planet1}</span>
                <span className="mx-1 font-black">{asp.typePt}</span>
                <span className="opacity-80">{asp.planet2}</span>
                <span className="ml-1.5 font-base text-[10px] font-medium opacity-60">
                  {asp.orb}°
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
