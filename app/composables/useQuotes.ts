import { DAILY_QUOTES } from '~/data/daily-quotes'
import type { DailyQuote, QuoteCategory } from '~/data/daily-quotes'

export function useQuotes() {
  const { currentDay } = useRamadanDay()
  const { locale, t } = useI18n()

  const todayQuote = computed<DailyQuote | null>(() => {
    const day = currentDay.value
    if (day <= 0 || day > 30) return null
    return DAILY_QUOTES.find((q) => q.day === day) ?? null
  })

  const previousQuotes = computed<readonly DailyQuote[]>(() => {
    const day = currentDay.value
    if (day <= 1) return []
    return DAILY_QUOTES.filter((q) => q.day < day).toSorted((a, b) => b.day - a.day)
  })

  function getQuoteByDay(day: number): DailyQuote | null {
    if (day < 1 || day > 30) return null
    return DAILY_QUOTES.find((q) => q.day === day) ?? null
  }

  function getMeaning(quote: DailyQuote): string {
    switch (locale.value) {
      case 'ru': return quote.meaningRu
      case 'en': return quote.meaningEn
      default: return quote.meaningUz
    }
  }

  function getTransliteration(quote: DailyQuote): string {
    if (locale.value === 'uz') return quote.transliterationUz
    return quote.transliteration
  }

  function getCategoryLabel(category: QuoteCategory): string {
    return t(`quotes.categories.${category}`)
  }

  return {
    todayQuote,
    previousQuotes,
    getQuoteByDay,
    getMeaning,
    getTransliteration,
    getCategoryLabel,
  }
}
