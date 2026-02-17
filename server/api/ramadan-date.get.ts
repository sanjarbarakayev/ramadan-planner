interface AladhanHijriResponse {
  data: {
    hijri: {
      date: string
      day: string
      month: { number: number; en: string }
      year: string
    }
    gregorian: {
      date: string
      day: string
      month: { number: number; en: string }
      year: string
    }
  }
}

const FALLBACK = { date: '2026-02-19', hijriYear: 1447 }

const checkRateLimit = useRateLimit({ maxRequests: 10, windowMs: 60_000 })

export default defineCachedEventHandler(async (event) => {
  checkRateLimit(event)

  const query = getQuery(event)
  const clientDate = query.date as string | undefined

  let dd: string, mm: string, yyyy: number
  if (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate)) {
    const parts = clientDate.split('-')
    yyyy = parseInt(parts[0]!, 10)
    mm = String(parseInt(parts[1]!, 10)).padStart(2, '0')
    dd = String(parseInt(parts[2]!, 10)).padStart(2, '0')
  } else {
    const today = new Date()
    dd = String(today.getDate()).padStart(2, '0')
    mm = String(today.getMonth() + 1).padStart(2, '0')
    yyyy = today.getFullYear()
  }

  try {
    const hijriRes = await $fetch<AladhanHijriResponse>(
      `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`,
    )

    const hijriMonth = hijriRes.data.hijri.month.number
    let hijriYear = parseInt(hijriRes.data.hijri.year, 10)

    if (hijriMonth > 9) {
      hijriYear += 1
    }

    const ramadanRes = await $fetch<AladhanHijriResponse>(
      `https://api.aladhan.com/v1/hToG/01-09-${hijriYear}`,
    )

    const greg = ramadanRes.data.gregorian
    const [day, month, year] = greg.date.split('-')

    return {
      date: `${year}-${month}-${day}`,
      hijriYear,
    }
  } catch {
    return FALLBACK
  }
}, {
  maxAge: 604800, // 7 days
  swr: true,
  getKey(event) {
    const query = getQuery(event)
    const clientDate = query.date as string || 'current'
    return `ramadan-date:${clientDate}`
  },
})
