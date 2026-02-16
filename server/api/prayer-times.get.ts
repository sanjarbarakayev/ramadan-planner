export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const city = query.city as string
  const country = query.country as string
  const method = query.method as string || '14'

  if (!city) {
    throw createError({ statusCode: 400, message: 'City is required' })
  }

  const today = new Date()
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`

  const url = new URL('https://api.aladhan.com/v1/timingsByCity/' + dateStr)
  url.searchParams.set('city', city)
  url.searchParams.set('country', country || '')
  url.searchParams.set('method', method)

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
})
