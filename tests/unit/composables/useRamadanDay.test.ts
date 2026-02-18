import { describe, it, expect, beforeEach } from 'vitest'
import { clearStateRegistry, useState } from '../../mocks/imports'
import type { Profile } from '~/composables/useProfile'

beforeEach(() => {
  clearStateRegistry()
})

function setupRamadanDayDeps(profileDate?: string, devDateOverride?: string) {
  useState<string | null>('dev-date-override', () => devDateOverride ?? null)
  useState<number | null>('dev-garden-override', () => null)
  const profile = useState<Profile | null>('profile', () => profileDate ? {
    id: 'test-user',
    language: 'en',
    theme: 'default',
    city: null,
    country: null,
    lat: null,
    lng: null,
    ramadan_start_date: profileDate,
    prayer_method: 14,
    time_adjustment: 0,
    onboarding_complete: true,
  } : null)
  return { profile }
}

describe('useRamadanDay', () => {
  it('returns expected properties', async () => {
    setupRamadanDayDeps('2026-02-19')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const result = useRamadanDay()
    expect(result).toHaveProperty('currentDay')
    expect(result).toHaveProperty('daysUntil')
    expect(result).toHaveProperty('isBefore')
    expect(result).toHaveProperty('isDuring')
    expect(result).toHaveProperty('isAfter')
    expect(result).toHaveProperty('ramadanStart')
  })

  it('uses profile ramadan_start_date when available', async () => {
    setupRamadanDayDeps('2026-02-19')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { ramadanStart } = useRamadanDay()
    expect(ramadanStart.value.getFullYear()).toBe(2026)
    expect(ramadanStart.value.getMonth()).toBe(1)
    expect(ramadanStart.value.getDate()).toBe(19)
  })

  it('falls back to DEFAULT_RAMADAN_START when no profile', async () => {
    setupRamadanDayDeps()
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { ramadanStart } = useRamadanDay()
    // DEFAULT_RAMADAN_START is Feb 19, 2026
    expect(ramadanStart.value.getFullYear()).toBe(2026)
    expect(ramadanStart.value.getMonth()).toBe(1)
    expect(ramadanStart.value.getDate()).toBe(19)
  })

  it('currentDay is during Ramadan when useNow is Mar 1', async () => {
    // useNow mock returns Mar 1 2026, ramadan starts Feb 19
    // Day = Mar 1 - Feb 19 + 1 = 11
    setupRamadanDayDeps('2026-02-19')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { currentDay, isDuring } = useRamadanDay()
    expect(currentDay.value).toBe(11)
    expect(isDuring.value).toBe(true)
  })

  it('uses dev date override when active', async () => {
    // Set dev date to Feb 10 (before Ramadan)
    setupRamadanDayDeps('2026-02-19', '2026-02-10')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { isBefore, currentDay } = useRamadanDay()
    expect(isBefore.value).toBe(true)
    expect(currentDay.value).toBe(0)
  })

  it('daysUntil is 0 during Ramadan', async () => {
    setupRamadanDayDeps('2026-02-19')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { daysUntil } = useRamadanDay()
    expect(daysUntil.value).toBe(0)
  })

  it('isAfter is false during Ramadan', async () => {
    setupRamadanDayDeps('2026-02-19')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { isAfter } = useRamadanDay()
    expect(isAfter.value).toBe(false)
  })

  it('dev date after Ramadan shows isAfter true', async () => {
    setupRamadanDayDeps('2026-02-19', '2026-04-01')
    const { useRamadanDay } = await import('~/composables/useRamadanDay')
    const { isAfter } = useRamadanDay()
    expect(isAfter.value).toBe(true)
  })
})
