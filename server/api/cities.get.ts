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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = (query.q as string)?.trim()

  if (!q || q.length < 2) {
    return []
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('featuretype', 'city')

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
})
