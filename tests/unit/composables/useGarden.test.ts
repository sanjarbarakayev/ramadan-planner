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
  gender: 'male' | 'female' | null = 'female',
  devPercentage: number | null = null,
) {
  // Set up all shared state that useGarden depends on
  useState<Habit[]>('habits', () => [])
  useState<Map<string, boolean>>('habitEntries', () => new Map())
  useState<string | null>('dev-date-override', () => null)
  useState<number | null>('dev-garden-override', () => devPercentage)
  useState<Profile | null>('profile', () => gender ? {
    id: 'test-user',
    gender,
    language: 'en',
    theme: gender === 'male' ? 'men' : 'women',
    city: null,
    country: null,
    lat: null,
    lng: null,
    ramadan_start_date: '2026-02-19',
    prayer_method: 14,
    time_adjustment: 0,
    onboarding_complete: true,
  } : null)
}

describe('useGarden', () => {
  describe('growthStage', () => {
    it('returns barren for 0%', async () => {
      setupGardenDependencies('female', 0)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('barren')
    })

    it('returns sprouts for 10%', async () => {
      setupGardenDependencies('female', 10)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('sprouts')
    })

    it('returns small for 30%', async () => {
      setupGardenDependencies('female', 30)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('small')
    })

    it('returns medium for 50%', async () => {
      setupGardenDependencies('female', 50)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('medium')
    })

    it('returns lush for 70%', async () => {
      setupGardenDependencies('female', 70)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('lush')
    })

    it('returns paradise for 90%', async () => {
      setupGardenDependencies('female', 90)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('paradise')
    })

    it('returns paradise for 100%', async () => {
      setupGardenDependencies('female', 100)
      const { useGarden } = await import('~/composables/useGarden')
      const { growthStage } = useGarden()
      expect(growthStage.value).toBe('paradise')
    })
  })

  describe('overallPercentage without dev override', () => {
    it('uses real overallPercentage when devOverride is null', async () => {
      // Set up without dev percentage (null) -> uses real stats
      setupGardenDependencies('female', null)
      const { useGarden } = await import('~/composables/useGarden')
      const { overallPercentage, growthStage } = useGarden()
      // With no habits/entries, real percentage is 0
      expect(overallPercentage.value).toBe(0)
      expect(growthStage.value).toBe('barren')
    })
  })

  describe('gardenType', () => {
    it('returns palm for male', async () => {
      setupGardenDependencies('male', 0)
      const { useGarden } = await import('~/composables/useGarden')
      const { gardenType } = useGarden()
      expect(gardenType.value).toBe('palm')
    })

    it('returns tulip for female', async () => {
      setupGardenDependencies('female', 0)
      const { useGarden } = await import('~/composables/useGarden')
      const { gardenType } = useGarden()
      expect(gardenType.value).toBe('tulip')
    })
  })

  describe('flowerCount', () => {
    it('returns 0 for 0%', async () => {
      setupGardenDependencies('female', 0)
      const { useGarden } = await import('~/composables/useGarden')
      const { flowerCount } = useGarden()
      expect(flowerCount.value).toBe(0)
    })

    it('returns 5 for 55%', async () => {
      setupGardenDependencies('female', 55)
      const { useGarden } = await import('~/composables/useGarden')
      const { flowerCount } = useGarden()
      expect(flowerCount.value).toBe(5)
    })

    it('returns 10 for 100%', async () => {
      setupGardenDependencies('female', 100)
      const { useGarden } = await import('~/composables/useGarden')
      const { flowerCount } = useGarden()
      expect(flowerCount.value).toBe(10)
    })
  })
})
