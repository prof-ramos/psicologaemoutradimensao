'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useGeocode } from './use-geocode'

interface ChartFormProps {
  initialDate?:   string
  initialHora?:   string
  initialCidade?: string
  initialLat?:    string
  initialLng?:    string
}

export function ChartForm({
  initialDate   = '',
  initialHora   = '',
  initialCidade = '',
  initialLat    = '',
  initialLng    = '',
}: ChartFormProps) {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState(initialDate)
  const [birthTime, setBirthTime] = useState(initialHora)
  const [cityName,  setCityName]  = useState(initialCidade)
  const [lat,       setLat]       = useState(initialLat)
  const [lng,       setLng]       = useState(initialLng)
  const [isPending, startTransition] = useTransition()

  const geo = useGeocode()

  function handleCityChange(value: string) {
    setCityName(value)
    setLat('')
    setLng('')
  }

  function selectCity(result: { display_name: string; lat: string; lon: string }) {
    const cityLabel = typeof result.display_name === 'string' && result.display_name.includes(',')
      ? result.display_name.split(',')[0].trim()
      : (result.display_name ?? '').trim()
    setCityName(cityLabel)
    setLat(result.lat)
    setLng(result.lon)
    geo.clear()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!birthDate || !lat || !lng) return
    const params = new URLSearchParams({ data: birthDate, lat, lng })
    if (birthTime) params.set('hora',   birthTime)
    if (cityName)  params.set('cidade', cityName)
    startTransition(() => {
      router.push(`/mapa-astral?${params.toString()}`)
    })
  }

  const nLat = lat ? Number(lat) : NaN
  const nLng = lng ? Number(lng) : NaN
  const hasValidCoords = Number.isFinite(nLat) && Number.isFinite(nLng)
  const labelClassName = 'font-heading text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-foreground/72'
  const inputClassName = 'h-12 w-full rounded-2xl border border-border/10 bg-surface px-4 text-sm text-foreground shadow-[var(--shadow-soft)] outline-none transition focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10'

  return (
    <section className="rounded-[1.75rem] border border-border/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.88))] p-6 shadow-[var(--shadow-shadow)] md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:mb-8">
        <p className="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground/52">
          Dados de nascimento
        </p>
        <h2 className="max-w-2xl text-balance font-heading text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
          Preencha o essencial e calcule seu mapa em segundos.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          A busca da cidade identifica latitude e longitude automaticamente. O horário é opcional, mas melhora o cálculo de casas e Ascendente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="nascimento-data" className={labelClassName}>
              Data de nascimento *
            </label>
            <input
              id="nascimento-data"
              type="date"
              required
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nascimento-hora" className={labelClassName}>
              Hora de nascimento <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="nascimento-hora"
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className={inputClassName}
            />
            {!birthTime && (
              <p className="px-1 text-xs leading-5 text-muted-foreground">
                Sem horário, casas e Ascendente não serão calculados.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="nascimento-cidade" className={labelClassName}>
            Cidade de nascimento *
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              id="nascimento-cidade"
              type="text"
              required
              aria-required="true"
              value={cityName}
              onChange={e => handleCityChange(e.target.value)}
              placeholder="Ex: São Paulo"
              className={inputClassName}
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => geo.search(cityName)}
              disabled={geo.isSearching || !cityName.trim()}
              className="w-full md:w-auto"
            >
              {geo.isSearching
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Search className="h-4 w-4" />
              }
              Buscar cidade
            </Button>
          </div>

          {geo.error && (
            <p className="px-1 text-xs font-medium text-amber-800" role="alert">
              {geo.error}
            </p>
          )}

          {geo.results.length > 0 && (
            <div aria-live="polite" aria-atomic="true" className="overflow-hidden rounded-[1.25rem] border border-border/10 bg-surface">
              <ul
                role="listbox"
                aria-label="Resultados de cidades"
                className="divide-y divide-border/10"
              >
                {geo.results.map((r) => (
                  <li
                    key={r.place_id ?? r.osm_id ?? `${r.lat}-${r.lon}`}
                    role="option"
                    aria-selected={cityName === (r.display_name.split(',')[0]?.trim())}
                  >
                    <button
                      type="button"
                      onClick={() => selectCity(r)}
                      className="w-full px-4 py-3 text-left text-sm leading-6 text-foreground transition-colors hover:bg-muted/75"
                    >
                      {r.display_name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasValidCoords && (
            <p className="px-1 text-xs leading-5 text-muted-foreground">
              Localização selecionada: {nLat.toFixed(2)}°, {nLng.toFixed(2)}°
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/10 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted-foreground">
            O resultado abre na mesma página e pode ser compartilhado pela URL.
          </p>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={!birthDate || !lat || !lng || isPending}
            className="w-full sm:w-auto"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Calcular mapa astral
          </Button>
        </div>
      </form>
    </section>
  )
}
