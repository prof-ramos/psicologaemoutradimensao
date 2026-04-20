interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  [key: string]: unknown
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''

  if (q.trim().length < 2) {
    return Response.json({ error: 'Query muito curta' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PsicologaEmOutraDimensao/1.0 (psicologaemoutradimensao.vercel.app)',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return Response.json({ error: 'Serviço de geocoding indisponível' }, { status: 502 })
    }

    const data: NominatimResult[] = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
