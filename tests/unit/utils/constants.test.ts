import { describe, it, expect } from 'vitest'
import {
  DEFAULT_HABITS,
  HABIT_CATEGORIES,
  RAMADAN_DAYS,
  PRAYER_METHODS,
  GROWTH_STAGE_THRESHOLDS,
  FLOWER_COUNT_DIVISOR,
} from '~/utils/constants'

describe('DEFAULT_HABITS', () => {
  it('has 9 default habits', () => {
    expect(DEFAULT_HABITS).toHaveLength(9)
  })

  it('each habit has required fields', () => {
    for (const habit of DEFAULT_HABITS) {
      expect(habit.key).toBeDefined()
      expect(habit.nameUz).toBeDefined()
      expect(habit.nameRu).toBeDefined()
      expect(habit.nameEn).toBeDefined()
      expect(habit.category).toBeDefined()
      expect(habit.targetDays).toBeGreaterThan(0)
      expect(habit.sortOrder).toBeGreaterThan(0)
    }
  })

  it('sort orders are sequential from 1 to 9', () => {
    const sortOrders = DEFAULT_HABITS.map((h) => h.sortOrder)
    expect(sortOrders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})

describe('HABIT_CATEGORIES', () => {
  it('has 5 categories', () => {
    expect(HABIT_CATEGORIES).toHaveLength(5)
  })

  it('includes prayer, quran, charity, food, worship', () => {
    expect(HABIT_CATEGORIES).toContain('prayer')
    expect(HABIT_CATEGORIES).toContain('quran')
    expect(HABIT_CATEGORIES).toContain('charity')
    expect(HABIT_CATEGORIES).toContain('food')
    expect(HABIT_CATEGORIES).toContain('worship')
  })
})

describe('RAMADAN_DAYS', () => {
  it('is 30', () => {
    expect(RAMADAN_DAYS).toBe(30)
  })
})

describe('PRAYER_METHODS', () => {
  it('has 21 methods', () => {
    expect(PRAYER_METHODS).toHaveLength(21)
  })

  it('each method has id and name', () => {
    for (const method of PRAYER_METHODS) {
      expect(typeof method.id).toBe('number')
      expect(typeof method.name).toBe('string')
      expect(method.name.length).toBeGreaterThan(0)
    }
  })

  it('includes Russian method (id 14)', () => {
    const russian = PRAYER_METHODS.find((m) => m.id === 14)
    expect(russian).toBeDefined()
    expect(russian?.name).toContain('Russia')
  })
})

describe('GROWTH_STAGE_THRESHOLDS', () => {
  it('has 6 stages', () => {
    expect(GROWTH_STAGE_THRESHOLDS).toHaveLength(6)
  })

  it('is ordered from highest to lowest min', () => {
    for (let i = 1; i < GROWTH_STAGE_THRESHOLDS.length; i++) {
      expect(GROWTH_STAGE_THRESHOLDS[i - 1]!.min).toBeGreaterThan(GROWTH_STAGE_THRESHOLDS[i]!.min)
    }
  })

  it('lowest threshold is 0 (barren)', () => {
    const last = GROWTH_STAGE_THRESHOLDS[GROWTH_STAGE_THRESHOLDS.length - 1]
    expect(last?.min).toBe(0)
    expect(last?.stage).toBe('barren')
  })

  it('highest threshold is 90 (paradise)', () => {
    expect(GROWTH_STAGE_THRESHOLDS[0]?.min).toBe(90)
    expect(GROWTH_STAGE_THRESHOLDS[0]?.stage).toBe('paradise')
  })
})

describe('FLOWER_COUNT_DIVISOR', () => {
  it('is 10', () => {
    expect(FLOWER_COUNT_DIVISOR).toBe(10)
  })
})
