'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Search, Globe } from 'lucide-react'
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

  return (
    <div className="border-2 border-border bg-background p-6 shadow-shadow md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Data de Nascimento */}
          <div className="space-y-2">
            <label
              htmlFor="nascimento-data"
              className="font-heading text-sm font-black uppercase tracking-wider text-foreground"
            >
              Data de nascimento *
            </label>
            <input
              id="nascimento-data"
              type="date"
              required
              aria-required="true"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full border-2 border-border bg-secondary-background px-4 py-3 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-main transition-all"
            />
          </div>

          {/* Hora de Nascimento */}
          <div className="space-y-2">
            <label
              htmlFor="nascimento-hora"
              className="font-heading text-sm font-black uppercase tracking-wider text-foreground"
            >
              Hora de nascimento{' '}
              <span className="font-normal normal-case text-muted-foreground opacity-70">
                (opcional)
              </span>
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="nascimento-hora"
                type="time"
                value={birthTime}
                onChange={e => setBirthTime(e.target.value)}
                className="w-full border-2 border-border bg-secondary-background px-4 py-3 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-main transition-all"
              />
              {!birthTime && (
                <p className="font-base text-[10px] leading-tight text-muted-foreground italic">
                  Sem horário, casas e Ascendente não serão calculados.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cidade de Nascimento */}
        <div className="space-y-3">
          <label
            htmlFor="nascimento-cidade"
            className="font-heading text-sm font-black uppercase tracking-wider text-foreground"
          >
            Cidade de nascimento *
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                id="nascimento-cidade"
                type="text"
                required
                aria-required="true"
                value={cityName}
                onChange={e => handleCityChange(e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full border-2 border-border bg-secondary-background px-4 py-3 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-main transition-all"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => geo.search(cityName)}
              disabled={geo.isSearching || !cityName.trim()}
            >
              {geo.isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Buscar</span>
            </Button>
          </div>

          {/* Feedback e Resultados de Geocoding */}
          <div className="space-y-2">
            {geo.error && (
              <p className="border-2 border-border bg-electric-orange/10 px-3 py-1.5 font-base text-xs font-bold text-electric-orange" role="alert">
                {geo.error}
              </p>
            )}

            {geo.results.length > 0 && (
              <div aria-live="polite" aria-atomic="true" className="overflow-hidden border-2 border-border bg-background shadow-shadow">
                <ul role="listbox" aria-label="Resultados de cidades" className="divide-y-2 divide-border">
                  {geo.results.map((r) => (
                    <li
                      key={r.place_id ?? r.osm_id ?? `${r.lat}-${r.lon}`}
                      role="option"
                      aria-selected={cityName === (r.display_name.split(',')[0]?.trim())}
                    >
                      <button
                        type="button"
                        onClick={() => selectCity(r)}
                        className="w-full px-4 py-3 text-left font-base text-sm hover:bg-main hover:text-main-foreground transition-all focus:outline-none focus:bg-main focus:text-main-foreground"
                      >
                        {r.display_name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasValidCoords && (
              <p className="inline-flex items-center gap-2 border-2 border-border bg-main/20 px-3 py-1 font-base text-xs font-bold text-foreground shadow-sm">
                <span className="text-main-foreground">✓</span> {cityName} selecionada ({nLat.toFixed(2)}°, {nLng.toFixed(2)}°)
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="cosmic"
            size="lg"
            className="w-full md:w-auto md:min-w-[240px]"
            disabled={!birthDate || !lat || !lng || isPending}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Globe className="h-5 w-5" />
            )}
            <span>Calcular Mapa Astral</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
