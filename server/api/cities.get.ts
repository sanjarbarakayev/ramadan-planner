import { citiesQuerySchema } from '../utils/schemas'

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

const checkRateLimit = useRateLimit({ maxRequests: 20, windowMs: 60_000 })

export default defineCachedEventHandler(async (event) => {
  checkRateLimit(event)

  const rawQuery = getQuery(event)
  const parsed = citiesQuerySchema.safeParse(rawQuery)

  if (!parsed.success) {
    return []
  }

  const { q } = parsed.data

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('featuretype', 'city')

  try {
    const results = await $fetch<NominatimResult[]>(url.toString(), {
      headers: {
        'User-Agent': 'RamadanPlanner/1.0',
      },
    })

    return results.map((r) => ({
      id: r.place_id,
      city: r.address.city || r.address.town || r.address.village || r.display_name.split(',')[0],
      country: r.address.country || '',
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    }))
  } catch {
    throw createError({ statusCode: 502, message: 'Failed to fetch cities from upstream' })
  }
}, {
  maxAge: 86400, // 24 hours
  swr: true,
  getKey(event) {
    const query = getQuery(event)
    return `cities:${(query.q as string || '').trim().toLowerCase()}`
  },
})
