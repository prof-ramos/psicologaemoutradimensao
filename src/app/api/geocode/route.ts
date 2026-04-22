import { validateGeocodeQuery, MAX_QUERY_LENGTH } from '@/lib/geocode-validation'

interface PhotonFeature {
  geometry: { coordinates: [number, number] }
  properties: {
    name?: string
    city?: string
    county?: string
    state?: string
    country?: string
    osm_id?: number
    osm_type?: string
    type?: string
  }
}

interface PhotonResponse {
  features: PhotonFeature[]
}

function buildDisplayName(p: PhotonFeature['properties']): string {
  const parts = [p.name, p.city, p.state, p.country].filter(Boolean)
  return parts.join(', ')
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

  const url = new URL('https://photon.komoot.io/api/')
  url.searchParams.set('q', trimmed)
  url.searchParams.set('limit', '5')
  url.searchParams.set('lang', 'default')

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': `PsicologaEmOutraDimensao/1.0 (${(process.env.NEXT_PUBLIC_BASE_URL ?? 'psicologaemoutradimensao.vercel.app').trim()})`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return Response.json({ error: 'Serviço de geocoding indisponível' }, { status: 502 })
    }

    const data: PhotonResponse = await res.json()
    const results = (data.features ?? []).map((f) => ({
      display_name: buildDisplayName(f.properties),
      lat: f.geometry.coordinates[1].toString(),
      lon: f.geometry.coordinates[0].toString(),
      place_id: f.properties.osm_id,
    }))

    return Response.json(results)
  } catch (err) {
    console.error('geocode fetch error:', err, { q: trimmed })
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
