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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="nascimento-data"
            className="font-heading text-sm font-black uppercase tracking-wide"
          >
              Data de nascimento *
          </label>
          <input
            id="nascimento-data"
            type="date"
            required
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="nascimento-hora"
            className="font-heading text-sm font-black uppercase tracking-wide"
          >
            Hora de nascimento{' '}
            <span className="font-normal normal-case text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="nascimento-hora"
            type="time"
            value={birthTime}
            onChange={e => setBirthTime(e.target.value)}
            className="w-full border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
          {!birthTime && (
            <p className="font-base text-xs text-muted-foreground">
              Sem horário, casas e Ascendente não serão calculados.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="nascimento-cidade"
          className="font-heading text-sm font-black uppercase tracking-wide"
        >
          Cidade de nascimento *
        </label>
        <div className="flex gap-2">
          <input
            id="nascimento-cidade"
            type="text"
            required
            aria-required="true"
            value={cityName}
            onChange={e => handleCityChange(e.target.value)}
            placeholder="Ex: São Paulo"
            className="flex-1 border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => geo.search(cityName)}
            disabled={geo.isSearching || !cityName.trim()}
          >
            {geo.isSearching
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Search className="h-4 w-4" />
            }
            Buscar
          </Button>
        </div>

        {geo.error && (
          <p className="font-base text-xs text-electric-orange font-bold" role="alert">
            {geo.error}
          </p>
        )}

        {geo.results.length > 0 && (
          <div aria-live="polite" aria-atomic="true">
            <ul
              role="listbox"
              aria-label="Resultados de cidades"
              className="border-2 border-border bg-background"
            >
              {geo.results.map((r) => (
                <li
                  key={r.place_id ?? r.osm_id ?? `${r.lat}-${r.lon}`}
                  role="option"
                  aria-selected={cityName === (r.display_name.split(',')[0]?.trim())}
                  className="first:border-0 border-t border-border"
                >
                  <button
                    type="button"
                    onClick={() => selectCity(r)}
                    className="w-full px-3 py-2 text-left font-base text-sm hover:bg-main transition-colors"
                  >
                    {r.display_name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasValidCoords && (
          <p className="font-base text-xs text-muted-foreground">
            ✓ Localização selecionada — {nLat.toFixed(2)}°, {nLng.toFixed(2)}°
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!birthDate || !lat || !lng || isPending}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Calcular mapa astral
      </Button>
    </form>
  )
}
