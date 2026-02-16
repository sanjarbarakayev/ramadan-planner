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

export default defineEventHandler(async () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  // Convert today to Hijri to find current Hijri year
  const hijriRes = await $fetch<AladhanHijriResponse>(
    `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`,
  )

  const hijriMonth = hijriRes.data.hijri.month.number
  let hijriYear = parseInt(hijriRes.data.hijri.year, 10)

  // Ramadan is month 9. If we're past Ramadan, use next Hijri year
  if (hijriMonth > 9) {
    hijriYear += 1
  }

  // Convert Ramadan 1 of the target Hijri year to Gregorian
  const ramadanRes = await $fetch<AladhanHijriResponse>(
    `https://api.aladhan.com/v1/hToG/01-09-${hijriYear}`,
  )

  const greg = ramadanRes.data.gregorian
  // API returns DD-MM-YYYY, convert to YYYY-MM-DD
  const [day, month, year] = greg.date.split('-')

  return {
    date: `${year}-${month}-${day}`,
    hijriYear,
  }
})
