import type { OnThisDayResult, WikiEvent } from './types'

const MAX_ITEMS = 8

export async function fetchOnThisDay(
  month: number,
  day: number,
  birthYear?: number
): Promise<OnThisDayResult> {
  try {
    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const url = `https://pt.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`

    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) return empty()

    const data = (await res.json()) as {
      events?: WikiEvent[]
      births?: WikiEvent[]
      deaths?: WikiEvent[]
    }

    const allEvents = data.events ?? []
    const allBirths = data.births ?? []
    const allDeaths = data.deaths ?? []

    const exactDayEvents: WikiEvent[] = birthYear
      ? [
          ...allEvents.filter((e) => e.year === birthYear),
          ...allBirths.filter((e) => e.year === birthYear),
          ...allDeaths.filter((e) => e.year === birthYear),
        ]
      : []

    return {
      events: allEvents.slice(0, MAX_ITEMS),
      births: allBirths.slice(0, MAX_ITEMS),
      deaths: allDeaths.slice(0, MAX_ITEMS),
      exactDayEvents,
    }
  } catch {
    return empty()
  }
}

function empty(): OnThisDayResult {
  return { events: [], births: [], deaths: [], exactDayEvents: [] }
}
