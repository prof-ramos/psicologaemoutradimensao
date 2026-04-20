'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GeoResult {
  display_name: string
  lat: string
  lon: string
}

interface ChartFormProps {
  initialData?: string
  initialHora?: string
  initialCidade?: string
  initialLat?: string
  initialLng?: string
}

export function ChartForm({
  initialData  = '',
  initialHora  = '',
  initialCidade = '',
  initialLat   = '',
  initialLng   = '',
}: ChartFormProps) {
  const router = useRouter()
  const [data,       setData]       = useState(initialData)
  const [hora,       setHora]       = useState(initialHora)
  const [cidade,     setCidade]     = useState(initialCidade)
  const [lat,        setLat]        = useState(initialLat)
  const [lng,        setLng]        = useState(initialLng)
  const [geoResults, setGeoResults] = useState<GeoResult[]>([])
  const [isSearching,setIsSearching]= useState(false)
  const [geoError,   setGeoError]   = useState('')
  const [isPending,  startTransition]= useTransition()

  async function handleCitySearch() {
    if (!cidade.trim()) return
    setIsSearching(true)
    setGeoError('')
    setGeoResults([])
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(cidade)}`)
      const json = await res.json()
      if (!Array.isArray(json) || json.length === 0) {
        setGeoError('Nenhuma cidade encontrada.')
      } else {
        setGeoResults(json.slice(0, 5))
      }
    } catch {
      setGeoError('Erro ao buscar cidade.')
    } finally {
      setIsSearching(false)
    }
  }

  function selectCity(result: GeoResult) {
    setCidade(result.display_name.split(',')[0].trim())
    setLat(result.lat)
    setLng(result.lon)
    setGeoResults([])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data || !lat || !lng) return
    const params = new URLSearchParams({ data, lat, lng })
    if (hora)   params.set('hora',   hora)
    if (cidade) params.set('cidade', cidade)
    startTransition(() => {
      router.push(`/mapa-astral?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Data */}
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
            value={data}
            onChange={e => setData(e.target.value)}
            className="w-full border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
        </div>

        {/* Hora */}
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
            value={hora}
            onChange={e => setHora(e.target.value)}
            className="w-full border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
          {!hora && (
            <p className="font-base text-xs text-muted-foreground">
              Sem horário, casas e Ascendente não serão calculados.
            </p>
          )}
        </div>
      </div>

      {/* Cidade */}
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
            value={cidade}
            onChange={e => { setCidade(e.target.value); setLat(''); setLng('') }}
            placeholder="Ex: São Paulo"
            className="flex-1 border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCitySearch}
            disabled={isSearching || !cidade.trim()}
          >
            {isSearching
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Search className="h-4 w-4" />
            }
            Buscar
          </Button>
        </div>

        {geoError && (
          <p className="font-base text-xs text-electric-orange font-bold">{geoError}</p>
        )}

        {geoResults.length > 0 && (
          <ul className="border-2 border-border bg-background">
            {geoResults.map((r, i) => (
              <li key={i} className={i > 0 ? 'border-t border-border' : ''}>
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
        )}

        {lat && lng && (
          <p className="font-base text-xs text-muted-foreground">
            ✓ Localização selecionada — {parseFloat(lat).toFixed(2)}°, {parseFloat(lng).toFixed(2)}°
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!data || !lat || !lng || isPending}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Calcular mapa astral
      </Button>
    </form>
  )
}
