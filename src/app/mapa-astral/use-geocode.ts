'use client'

import { useState } from 'react'

export interface GeoResult {
  display_name: string
  lat: string
  lon: string
}

export function useGeocode() {
  const [results,    setResults]    = useState<GeoResult[]>([])
  const [isSearching,setIsSearching]= useState(false)
  const [error,      setError]      = useState('')

  async function search(query: string) {
    if (!query.trim()) return
    setIsSearching(true)
    setError('')
    setResults([])
    try {
      const res  = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
      const json = await res.json()
      if (!Array.isArray(json) || json.length === 0) {
        setError('Nenhuma cidade encontrada.')
      } else {
        setResults(json.slice(0, 5))
      }
    } catch {
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
