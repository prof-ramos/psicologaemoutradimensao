import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { HoroscopeResult } from '@/lib/horoscope'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const ASPECT_VARIANTS = ['default', 'blue', 'pink', 'orange'] as const

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
    <div className="space-y-6">
      <div className="border-2 border-border bg-main p-4 shadow-shadow">
        <p className="font-heading text-sm font-black uppercase">
          {formattedDate}
          {hora ? ` às ${hora}` : ''}
          {cidade ? ` · ${cidade}` : ''}
        </p>
        {!data.hasHouses && (
          <p className="mt-1 font-base text-xs text-foreground/70">
            Sem horário — casas e Ascendente não calculados
          </p>
        )}
      </div>

      {data.hasHouses && (data.ascendant || data.midheaven) && (
        <div className="flex flex-wrap gap-3">
          {data.ascendant && (
            <div className="border-2 border-border bg-cosmic-blue px-4 py-2 shadow-shadow">
              <p className="font-heading text-xs font-black uppercase">
                Ascendente
              </p>
              <p className="font-base text-sm font-bold">
                {data.ascendant.signPt} {Math.floor(data.ascendant.degreeInSign)}°
              </p>
            </div>
          )}
          {data.midheaven && (
            <div className="border-2 border-border bg-vibrant-pink px-4 py-2 shadow-shadow">
              <p className="font-heading text-xs font-black uppercase">
                Meio do Céu
              </p>
              <p className="font-base text-sm font-bold">
                {data.midheaven.signPt} {Math.floor(data.midheaven.degreeInSign)}°
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <h2 className="font-heading text-lg font-black uppercase">Posições Planetárias</h2>
        <div className="border-2 border-border overflow-hidden">
          <table className="w-full font-base text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th scope="col" className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                  Planeta
                </th>
                <th scope="col" className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                  Signo
                </th>
                <th scope="col" className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                  Grau
                </th>
                {data.hasHouses && (
                  <th scope="col" className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                    Casa
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.positions.map((pos, i) => (
                <tr
                  key={pos.key}
                  className={cn(i % 2 === 0 ? 'bg-background' : 'bg-muted/40')}
                >
                  <td className="px-3 py-2 font-medium">
                    {pos.namePt}
                    {pos.isRetrograde && (
                      <span className="ml-1 text-xs text-muted-foreground" aria-label="Retrógrado">
                        ℞
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{pos.signPt}</td>
                  <td className="px-3 py-2 tabular-nums">{Math.floor(pos.degreeInSign)}°</td>
                  {data.hasHouses && (
                    <td className="px-3 py-2">{pos.house}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(data.aspects?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <h2 className="font-heading text-lg font-black uppercase">Aspectos Principais</h2>
          <div className="flex flex-wrap gap-2">
            {data.aspects.map((asp, i) => (
              <Badge
                key={`${asp.planet1}-${asp.typePt}-${asp.planet2}`}
                variant={ASPECT_VARIANTS[i % ASPECT_VARIANTS.length]}
              >
                {asp.planet1} {asp.typePt} {asp.planet2}
                <span className="ml-1 font-normal opacity-70">({asp.orb}°)</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
