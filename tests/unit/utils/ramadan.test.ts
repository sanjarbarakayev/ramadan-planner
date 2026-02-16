import { describe, it, expect } from 'vitest'
import {
  getRamadanDay,
  getDaysUntilRamadan,
  isBeforeRamadan,
  isDuringRamadan,
  isAfterRamadan,
  getRamadanDateForDay,
  DEFAULT_RAMADAN_START,
} from '../../../app/utils/ramadan'

const RAMADAN_START = new Date(2026, 1, 19) // Feb 19, 2026

describe('getRamadanDay', () => {
  it('returns 1 on the first day of Ramadan', () => {
    expect(getRamadanDay(new Date(2026, 1, 19), RAMADAN_START)).toBe(1)
  })

  it('returns 15 on the 15th day', () => {
    expect(getRamadanDay(new Date(2026, 2, 5), RAMADAN_START)).toBe(15)
  })

  it('returns 30 on the last day', () => {
    expect(getRamadanDay(new Date(2026, 2, 20), RAMADAN_START)).toBe(30)
  })

  it('returns 0 before Ramadan', () => {
    expect(getRamadanDay(new Date(2026, 1, 18), RAMADAN_START)).toBe(0)
  })

  it('returns 0 after Ramadan', () => {
    expect(getRamadanDay(new Date(2026, 2, 21), RAMADAN_START)).toBe(0)
  })
})

describe('getDaysUntilRamadan', () => {
  it('returns correct days before Ramadan', () => {
    expect(getDaysUntilRamadan(new Date(2026, 1, 7), RAMADAN_START)).toBe(12)
  })

  it('returns 0 on Ramadan start', () => {
    expect(getDaysUntilRamadan(new Date(2026, 1, 19), RAMADAN_START)).toBe(0)
  })

  it('returns 0 during Ramadan', () => {
    expect(getDaysUntilRamadan(new Date(2026, 2, 1), RAMADAN_START)).toBe(0)
  })

  it('returns 1 on the day before Ramadan', () => {
    expect(getDaysUntilRamadan(new Date(2026, 1, 18), RAMADAN_START)).toBe(1)
  })
})

describe('isBeforeRamadan', () => {
  it('returns true before Ramadan', () => {
    expect(isBeforeRamadan(new Date(2026, 1, 15), RAMADAN_START)).toBe(true)
  })

  it('returns false on Ramadan start', () => {
    expect(isBeforeRamadan(new Date(2026, 1, 19), RAMADAN_START)).toBe(false)
  })

  it('returns false during Ramadan', () => {
    expect(isBeforeRamadan(new Date(2026, 2, 1), RAMADAN_START)).toBe(false)
  })
})

describe('isDuringRamadan', () => {
  it('returns true on first day', () => {
    expect(isDuringRamadan(new Date(2026, 1, 19), RAMADAN_START)).toBe(true)
  })

  it('returns true on last day (day 30)', () => {
    expect(isDuringRamadan(new Date(2026, 2, 20), RAMADAN_START)).toBe(true)
  })

  it('returns false before Ramadan', () => {
    expect(isDuringRamadan(new Date(2026, 1, 18), RAMADAN_START)).toBe(false)
  })

  it('returns false after Ramadan', () => {
    expect(isDuringRamadan(new Date(2026, 2, 21), RAMADAN_START)).toBe(false)
  })
})

describe('isAfterRamadan', () => {
  it('returns false during Ramadan', () => {
    expect(isAfterRamadan(new Date(2026, 2, 1), RAMADAN_START)).toBe(false)
  })

  it('returns true after Ramadan', () => {
    expect(isAfterRamadan(new Date(2026, 2, 21), RAMADAN_START)).toBe(true)
  })
})

describe('getRamadanDateForDay', () => {
  it('returns correct date for day 1', () => {
    const date = getRamadanDateForDay(1, RAMADAN_START)
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(1) // Feb
    expect(date.getDate()).toBe(19)
  })

  it('returns correct date for day 15', () => {
    const date = getRamadanDateForDay(15, RAMADAN_START)
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(2) // Mar
    expect(date.getDate()).toBe(5)
  })
})

describe('DEFAULT_RAMADAN_START', () => {
  it('is set to Feb 19, 2026', () => {
    expect(DEFAULT_RAMADAN_START.getFullYear()).toBe(2026)
    expect(DEFAULT_RAMADAN_START.getMonth()).toBe(1)
    expect(DEFAULT_RAMADAN_START.getDate()).toBe(19)
  })
})
