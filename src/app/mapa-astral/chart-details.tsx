import type { BadgeProps } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { HoroscopeResult } from '@/lib/horoscope'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const ASPECT_VARIANTS: Record<string, BadgeProps['variant']> = {
  Conjunção: 'stone',
  Oposição: 'rose',
  Trígono: 'sky',
  Quadratura: 'amber',
  Sextil: 'default',
  Quincúncio: 'stone',
}

interface ChartDetailsProps {
  data: HoroscopeResult
  cidade: string
  dataStr: string   // "1990-03-15"
  hora?: string     // "14:30" ou undefined
}

export function ChartDetails({ data, cidade, dataStr, hora }: ChartDetailsProps) {
  let formattedDate = '—'
  try {
    formattedDate = format(parseISO(dataStr), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    // keep default '—'
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="rounded-[1.75rem] border border-border/10 bg-surface p-5 shadow-[var(--shadow-soft)] md:p-6">
        <p className="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground/52">
          Resumo
        </p>
        <p className="mt-3 text-balance font-heading text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">
          {formattedDate}
          {hora ? ` às ${hora}` : ''}
          {cidade ? ` · ${cidade}` : ''}
        </p>
        {!data.hasHouses && (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sem horário — casas e Ascendente não calculados
          </p>
        )}
      </section>

      {data.hasHouses && (data.ascendant || data.midheaven) && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.ascendant && (
            <div className="rounded-[1.5rem] border border-border/10 bg-cosmic-blue/30 px-5 py-4 shadow-[var(--shadow-soft)]">
              <p className="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                Ascendente
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-foreground">
                {data.ascendant.signPt} {Math.floor(data.ascendant.degreeInSign)}°
              </p>
            </div>
          )}
          {data.midheaven && (
            <div className="rounded-[1.5rem] border border-border/10 bg-vibrant-pink/35 px-5 py-4 shadow-[var(--shadow-soft)]">
              <p className="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                Meio do Céu
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-foreground">
                {data.midheaven.signPt} {Math.floor(data.midheaven.degreeInSign)}°
              </p>
            </div>
          )}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.06em] text-foreground">
          Posições planetárias
        </h2>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/10 bg-surface shadow-[var(--shadow-soft)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/10 bg-muted/60">
                <th scope="col" className="px-4 py-3 text-left font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                  Planeta
                </th>
                <th scope="col" className="px-4 py-3 text-left font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                  Signo
                </th>
                <th scope="col" className="px-4 py-3 text-left font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                  Grau
                </th>
                {data.hasHouses && (
                  <th scope="col" className="px-4 py-3 text-left font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                    Casa
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.positions.map((pos, i) => (
                <tr
                  key={pos.key}
                  className={cn(
                    'border-t border-border/6',
                    i % 2 === 0 ? 'bg-surface' : 'bg-muted/28'
                  )}
                >
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {pos.namePt}
                    {pos.isRetrograde && (
                      <span className="ml-1 text-xs text-muted-foreground" aria-label="Retrógrado">
                        ℞
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-foreground/80">{pos.signPt}</td>
                  <td className="px-4 py-3.5 tabular-nums text-foreground/80">{Math.floor(pos.degreeInSign)}°</td>
                  {data.hasHouses && (
                    <td className="px-4 py-3.5 text-foreground/80">{pos.house}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(data.aspects?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.06em] text-foreground">
            Aspectos principais
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {data.aspects.map((asp, i) => (
              <Badge
                key={`${asp.planet1}-${asp.typePt}-${asp.planet2}-${i}`}
                variant={ASPECT_VARIANTS[asp.typePt] ?? 'default'}
                className="px-3.5 py-1.5 normal-case tracking-[0.03em]"
              >
                {asp.planet1} {asp.typePt} {asp.planet2}
                <span className="ml-1 font-normal opacity-65">({asp.orb}°)</span>
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
