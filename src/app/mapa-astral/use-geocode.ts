'use client'

import { useRef, useState } from 'react'

export interface GeoResult {
  display_name: string
  lat: string
  lon: string
  place_id?: string | number
  osm_id?: string | number
}

export function useGeocode() {
  const [results, setResults] = useState<GeoResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  async function search(query: string) {
    if (!query.trim()) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsSearching(true)
    setError('')
    setResults([])
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
      if (!res.ok) {
        setError('Erro ao buscar cidade.')
        return
      }
      const json = await res.json()
      if (!Array.isArray(json) || json.length === 0) {
        setError('Nenhuma cidade encontrada.')
      } else {
        setResults(json.slice(0, 5))
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('useGeocode fetch error:', err)
      setError('Erro ao buscar cidade.')
    } finally {
      setIsSearching(false)
    }
  }

  function clear() {
    setResults([])
    setError('')
  }

  return { results, isSearching, error, search, clear }
}
