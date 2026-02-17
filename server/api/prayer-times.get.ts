import { prayerTimesQuerySchema } from '../utils/schemas'

const checkRateLimit = useRateLimit({ maxRequests: 30, windowMs: 60_000 })

export default defineCachedEventHandler(async (event) => {
  checkRateLimit(event)

  const rawQuery = getQuery(event)
  const parsed = prayerTimesQuerySchema.safeParse(rawQuery)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message ?? 'Invalid query' })
  }

  const { city, country, method, date: clientDate } = parsed.data

  let dateStr: string
  if (clientDate) {
    const parts = clientDate.split('-')
    dateStr = `${parseInt(parts[2]!, 10)}-${parseInt(parts[1]!, 10)}-${parseInt(parts[0]!, 10)}`
  } else {
    const today = new Date()
    dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
  }

  const url = new URL('https://api.aladhan.com/v1/timingsByCity/' + dateStr)
  url.searchParams.set('city', city)
  url.searchParams.set('country', country)
  url.searchParams.set('method', method)

  try {
    const response = await $fetch<{
      data: {
        timings: Record<string, string>
      }
    }>(url.toString())

    const timings = response.data.timings

    return {
      Imsak: timings.Imsak?.replace(/\s*\(.*\)/, '') ?? '',
      Fajr: timings.Fajr?.replace(/\s*\(.*\)/, '') ?? '',
      Sunrise: timings.Sunrise?.replace(/\s*\(.*\)/, '') ?? '',
      Dhuhr: timings.Dhuhr?.replace(/\s*\(.*\)/, '') ?? '',
      Asr: timings.Asr?.replace(/\s*\(.*\)/, '') ?? '',
      Maghrib: timings.Maghrib?.replace(/\s*\(.*\)/, '') ?? '',
      Isha: timings.Isha?.replace(/\s*\(.*\)/, '') ?? '',
    }
  } catch {
    throw createError({ statusCode: 502, message: 'Failed to fetch prayer times from upstream' })
  }
}, {
  maxAge: 43200,
  swr: true,
  getKey(event) {
    const query = getQuery(event)
    const city = (query.city as string || '').toLowerCase()
    const country = (query.country as string || '').toLowerCase()
    const method = query.method as string || '14'
    const date = query.date as string || new Date().toISOString().split('T')[0]
    return `prayer-times:${city}:${country}:${method}:${date}`
  },
})
