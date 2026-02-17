import { describe, it, expect } from 'vitest'
import { prayerTimesQuerySchema, citiesQuerySchema } from '../../../server/utils/schemas'

describe('prayerTimesQuerySchema', () => {
  it('accepts valid query with city', () => {
    const result = prayerTimesQuerySchema.safeParse({ city: 'Tashkent' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.city).toBe('Tashkent')
      expect(result.data.country).toBe('')
      expect(result.data.method).toBe('14')
    }
  })

  it('accepts full query params', () => {
    const result = prayerTimesQuerySchema.safeParse({
      city: 'London',
      country: 'UK',
      method: '2',
      date: '2026-02-19',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.city).toBe('London')
      expect(result.data.country).toBe('UK')
      expect(result.data.method).toBe('2')
      expect(result.data.date).toBe('2026-02-19')
    }
  })

  it('rejects empty city', () => {
    const result = prayerTimesQuerySchema.safeParse({ city: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing city', () => {
    const result = prayerTimesQuerySchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects invalid date format', () => {
    const result = prayerTimesQuerySchema.safeParse({
      city: 'Tashkent',
      date: '19-02-2026',
    })
    expect(result.success).toBe(false)
  })

  it('accepts query without date', () => {
    const result = prayerTimesQuerySchema.safeParse({ city: 'Tashkent' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.date).toBeUndefined()
    }
  })
})

describe('citiesQuerySchema', () => {
  it('accepts valid query with 2+ chars', () => {
    const result = citiesQuerySchema.safeParse({ q: 'Ta' })
    expect(result.success).toBe(true)
  })

  it('rejects query with 1 char', () => {
    const result = citiesQuerySchema.safeParse({ q: 'T' })
    expect(result.success).toBe(false)
  })

  it('rejects empty query', () => {
    const result = citiesQuerySchema.safeParse({ q: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing query', () => {
    const result = citiesQuerySchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
