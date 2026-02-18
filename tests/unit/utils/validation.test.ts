import { describe, it, expect } from 'vitest'
import { habitSchema, profileSchema } from '../../../app/utils/validation'

describe('habitSchema', () => {
  it('accepts valid habit data', () => {
    const result = habitSchema.safeParse({
      name_uz: 'Namoz',
      name_ru: 'Намаз',
      name_en: 'Prayer',
      category: 'prayer',
      target_days: 30,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name_uz', () => {
    const result = habitSchema.safeParse({
      name_uz: '',
      category: 'prayer',
      target_days: 30,
    })
    expect(result.success).toBe(false)
  })

  it('rejects name_uz over 100 chars', () => {
    const result = habitSchema.safeParse({
      name_uz: 'a'.repeat(101),
      category: 'prayer',
      target_days: 30,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid category', () => {
    const result = habitSchema.safeParse({
      name_uz: 'Test',
      category: 'invalid',
      target_days: 30,
    })
    expect(result.success).toBe(false)
  })

  it('accepts all valid categories', () => {
    for (const cat of ['prayer', 'quran', 'charity', 'food', 'worship']) {
      const result = habitSchema.safeParse({
        name_uz: 'Test',
        category: cat,
        target_days: 30,
      })
      expect(result.success).toBe(true)
    }
  })

  it('rejects target_days less than 1', () => {
    const result = habitSchema.safeParse({
      name_uz: 'Test',
      category: 'prayer',
      target_days: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejects target_days greater than 30', () => {
    const result = habitSchema.safeParse({
      name_uz: 'Test',
      category: 'prayer',
      target_days: 31,
    })
    expect(result.success).toBe(false)
  })

  it('defaults name_ru and name_en to empty string', () => {
    const result = habitSchema.safeParse({
      name_uz: 'Test',
      category: 'prayer',
      target_days: 15,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name_ru).toBe('')
      expect(result.data.name_en).toBe('')
    }
  })
})

describe('profileSchema', () => {
  it('accepts valid profile data', () => {
    const result = profileSchema.safeParse({
      language: 'uz',
      time_adjustment: 5,
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty object (all optional)', () => {
    const result = profileSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects invalid language', () => {
    const result = profileSchema.safeParse({ language: 'fr' })
    expect(result.success).toBe(false)
  })

  it('rejects time_adjustment below -60', () => {
    const result = profileSchema.safeParse({ time_adjustment: -61 })
    expect(result.success).toBe(false)
  })

  it('rejects time_adjustment above 60', () => {
    const result = profileSchema.safeParse({ time_adjustment: 61 })
    expect(result.success).toBe(false)
  })

  it('accepts valid ramadan_start_date format', () => {
    const result = profileSchema.safeParse({ ramadan_start_date: '2026-02-19' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid date format', () => {
    const result = profileSchema.safeParse({ ramadan_start_date: '19-02-2026' })
    expect(result.success).toBe(false)
  })
})
