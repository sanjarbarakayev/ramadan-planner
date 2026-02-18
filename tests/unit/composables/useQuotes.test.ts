import { describe, it, expect, beforeEach } from 'vitest'
import { clearStateRegistry, useState, setMockLocale } from '../../mocks/imports'
import type { Profile } from '~/composables/useProfile'
import { DAILY_QUOTES } from '~/data/daily-quotes'

beforeEach(() => {
  clearStateRegistry()
  setMockLocale('en')
})

function setupDeps(profileDate: string, devDateOverride?: string) {
  useState<string | null>('dev-date-override', () => devDateOverride ?? null)
  useState<number | null>('dev-garden-override', () => null)
  useState<Profile | null>('profile', () => ({
    id: 'test-user',
    language: 'en',
    theme: 'default',
    city: null,
    country: null,
    lat: null,
    lng: null,
    ramadan_start_date: profileDate,
    prayer_method: 3,
    time_adjustment: 0,
    onboarding_complete: true,
  }))
}

describe('useQuotes', () => {
  it('returns expected properties', async () => {
    setupDeps('2026-02-19')
    const { useQuotes } = await import('~/composables/useQuotes')
    const result = useQuotes()
    expect(result).toHaveProperty('todayQuote')
    expect(result).toHaveProperty('previousQuotes')
    expect(result).toHaveProperty('getQuoteByDay')
    expect(result).toHaveProperty('getMeaning')
    expect(result).toHaveProperty('getTransliteration')
    expect(result).toHaveProperty('getCategoryLabel')
  })

  it('returns todayQuote for day 10 of Ramadan', async () => {
    // 2026-02-19 is Ramadan start; dev date override = day 10 = 2026-02-28
    setupDeps('2026-02-19', '2026-02-28')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { todayQuote } = useQuotes()
    expect(todayQuote.value).not.toBeNull()
    expect(todayQuote.value?.day).toBe(10)
  })

  it('returns null todayQuote before Ramadan', async () => {
    setupDeps('2026-02-19', '2026-02-10')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { todayQuote } = useQuotes()
    expect(todayQuote.value).toBeNull()
  })

  it('returns previous quotes for day 5', async () => {
    setupDeps('2026-02-19', '2026-02-23')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { previousQuotes } = useQuotes()
    expect(previousQuotes.value).toHaveLength(4)
    // Should be in reverse order (day 4, 3, 2, 1)
    expect(previousQuotes.value[0].day).toBe(4)
    expect(previousQuotes.value[3].day).toBe(1)
  })

  it('returns empty previous quotes for day 1', async () => {
    setupDeps('2026-02-19', '2026-02-19')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { previousQuotes } = useQuotes()
    expect(previousQuotes.value).toHaveLength(0)
  })

  it('getQuoteByDay returns correct quote', async () => {
    setupDeps('2026-02-19')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { getQuoteByDay } = useQuotes()
    const quote = getQuoteByDay(1)
    expect(quote).not.toBeNull()
    expect(quote?.day).toBe(1)
    expect(quote?.category).toBe('quran')
  })

  it('getQuoteByDay returns null for out-of-range', async () => {
    setupDeps('2026-02-19')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { getQuoteByDay } = useQuotes()
    expect(getQuoteByDay(0)).toBeNull()
    expect(getQuoteByDay(31)).toBeNull()
    expect(getQuoteByDay(-1)).toBeNull()
  })

  it('getMeaning returns correct language', async () => {
    setupDeps('2026-02-19')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { getMeaning } = useQuotes()
    const quote = DAILY_QUOTES[0]

    setMockLocale('en')
    expect(getMeaning(quote)).toBe(quote.meaningEn)

    setMockLocale('ru')
    expect(getMeaning(quote)).toBe(quote.meaningRu)

    setMockLocale('uz')
    expect(getMeaning(quote)).toBe(quote.meaningUz)
  })

  it('getTransliteration returns uz variant for uz locale', async () => {
    setupDeps('2026-02-19')
    const { useQuotes } = await import('~/composables/useQuotes')
    const { getTransliteration } = useQuotes()
    const quote = DAILY_QUOTES[0]

    setMockLocale('uz')
    expect(getTransliteration(quote)).toBe(quote.transliterationUz)

    setMockLocale('en')
    expect(getTransliteration(quote)).toBe(quote.transliteration)
  })
})

describe('daily-quotes data', () => {
  it('has exactly 30 entries', () => {
    expect(DAILY_QUOTES).toHaveLength(30)
  })

  it('has unique days from 1 to 30', () => {
    const days = DAILY_QUOTES.map((q) => q.day)
    const uniqueDays = [...new Set(days)]
    expect(uniqueDays).toHaveLength(30)
    for (let d = 1; d <= 30; d++) {
      expect(days).toContain(d)
    }
  })

  it('each quote has all required fields', () => {
    for (const quote of DAILY_QUOTES) {
      expect(quote.arabic).toBeTruthy()
      expect(quote.transliteration).toBeTruthy()
      expect(quote.transliterationUz).toBeTruthy()
      expect(quote.meaningUz).toBeTruthy()
      expect(quote.meaningRu).toBeTruthy()
      expect(quote.meaningEn).toBeTruthy()
      expect(quote.source).toBeTruthy()
      expect(['quran', 'hadith', 'wisdom']).toContain(quote.category)
    }
  })

  it('has a mix of categories', () => {
    const categories = new Set(DAILY_QUOTES.map((q) => q.category))
    expect(categories.size).toBe(3)
    expect(categories.has('quran')).toBe(true)
    expect(categories.has('hadith')).toBe(true)
    expect(categories.has('wisdom')).toBe(true)
  })
})
