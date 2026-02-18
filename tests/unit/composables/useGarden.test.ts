import { describe, it, expect, beforeEach } from 'vitest'
import { clearStateRegistry, useState } from '../../mocks/imports'
import type { Habit } from '~/composables/useHabits'
import type { Profile } from '~/composables/useProfile'
import {
  GROWTH_STAGE_THRESHOLDS,
  FLOWER_COUNT_DIVISOR,
} from '~/utils/constants'

beforeEach(() => {
  clearStateRegistry()
})

function setupGardenDependencies(
  devPercentage: number | null = null,
) {
  // Set up all shared state that useGarden depends on
  useState<Habit[]>('habits', () => [])
  useState<Map<string, boolean>>('habitEntries', () => new Map())
  useState<string | null>('dev-date-override', () => null)
  useState<number | null>('dev-garden-override', () => devPercentage)
  useState<Profile | null>('profile', () => ({
    id: 'test-user',
    language: 'en',
    theme: 'default',
    city: null,
    country: null,
    lat: null,
    lng: null,
    ramadan_start_date: '2026-02-19',
    prayer_method: 14,
    time_adjustment: 0,
    onboarding_complete: true,
  }))
}

describe('useGarden', () => {
  describe('growthStage', () => {
    it('returns barren for 0%', async () => {
      setupGardenDependencies(0)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('barren')
    })

    it('returns sprouts for 10%', async () => {
      setupGardenDependencies(10)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('sprouts')
    })

    it('returns small for 30%', async () => {
      setupGardenDependencies(30)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('small')
    })

    it('returns medium for 50%', async () => {
      setupGardenDependencies(50)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('medium')
    })

    it('returns lush for 70%', async () => {
      setupGardenDependencies(70)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('lush')
    })

    it('returns paradise for 90%', async () => {
      setupGardenDependencies(90)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('paradise')
    })

    it('returns paradise for 100%', async () => {
      setupGardenDependencies(100)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('paradise')
    })
  })

  describe('overallPercentage without dev override', () => {
    it('uses real overallPercentage when devOverride is null', async () => {
      // Set up without dev percentage (null) -> uses real stats
      setupGardenDependencies(null)
      const { useGarden } = await import('~/composables/useGarden')
      const { overallPercentage, growthStage } = useGarden()
      // With no habits/entries, real percentage is 0
      expect(overallPercentage.value).toBe(0)
      expect(growthStage.value).toBe('barren')
    })
  })

  describe('gardenType', () => {
    it('returns palm', async () => {
      setupGardenDependencies(0)
      const { useGarden } = await import('~/composables/useGarden')
      const { gardenType } = useGarden()
      expect(gardenType.value).toBe('palm')
    })
  })

  describe('flowerCount', () => {
    it('returns 0 for 0%', async () => {
      setupGardenDependencies(0)
      const { useGarden } = await import('~/composables/useGarden')
      const { flowerCount } = useGarden()
      expect(flowerCount.value).toBe(0)
    })

    it('returns 5 for 55%', async () => {
      setupGardenDependencies(55)
      const { useGarden } = await import('~/composables/useGarden')
      const { flowerCount } = useGarden()
      expect(flowerCount.value).toBe(5)
    })

    it('returns 10 for 100%', async () => {
      setupGardenDependencies(100)
      const { useGarden } = await import('~/composables/useGarden')
      const { flowerCount } = useGarden()
      expect(flowerCount.value).toBe(10)
    })
  })
})
