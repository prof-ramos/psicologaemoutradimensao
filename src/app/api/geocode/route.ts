import { validateGeocodeQuery, MAX_QUERY_LENGTH } from '@/lib/geocode-validation'

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  place_id?: string | number
  osm_id?: string | number
  [key: string]: unknown
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const trimmed = q.trim()

  if (!validateGeocodeQuery(trimmed)) {
    const tooLong = trimmed.length > MAX_QUERY_LENGTH
    return Response.json(
      { error: tooLong ? 'Query muito longa' : 'Query muito curta' },
      { status: 400 }
    )
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', trimmed)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': `PsicologaEmOutraDimensao/1.0 (${process.env.NEXT_PUBLIC_BASE_URL ?? 'psicologaemoutradimensao.vercel.app'})`,
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return Response.json({ error: 'Serviço de geocoding indisponível' }, { status: 502 })
    }

    const data: NominatimResult[] = await res.json()
    return Response.json(data)
  } catch (err) {
    console.error('geocode fetch error:', err, { q: trimmed })
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
