import { describe, it, expect, beforeEach } from 'vitest'
import { clearStateRegistry, useState } from '../../mocks/imports'

import type { Habit } from '~/composables/useHabits'

const makeHabit = (id: string, targetDays = 30): Habit => ({
  id,
  user_id: 'test-user-id',
  name_uz: `Habit ${id}`,
  name_ru: `Habit ${id}`,
  name_en: `Habit ${id}`,
  category: 'worship',
  target_days: targetDays,
  sort_order: 1,
  is_custom: false,
  is_active: true,
})

function setupHabitsAndEntries(
  habitsData: Habit[],
  entriesData: Map<string, boolean>,
) {
  useState<Habit[]>('habits', () => habitsData)
  useState<Map<string, boolean>>('habitEntries', () => entriesData)
  useState<string | null>('dev-date-override', () => null)
  useState<number | null>('dev-garden-override', () => null)
}

function setupWithDevDate(
  habitsData: Habit[],
  entriesData: Map<string, boolean>,
  devDate: string | null,
) {
  useState<Habit[]>('habits', () => habitsData)
  useState<Map<string, boolean>>('habitEntries', () => entriesData)
  useState<string | null>('dev-date-override', () => devDate)
  useState<number | null>('dev-garden-override', () => null)
}

beforeEach(() => {
  clearStateRegistry()
})

describe('useStats', () => {
  it('module can be imported', async () => {
    setupHabitsAndEntries([], new Map())
    const { useStats } = await import('~/composables/useStats')
    expect(useStats()).toBeDefined()
  })

  it('todayTotal equals number of habits', async () => {
    setupHabitsAndEntries([makeHabit('h1'), makeHabit('h2')], new Map())
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().todayTotal.value).toBe(2)
  })

  it('todayPercentage is 0 when no habits exist', async () => {
    setupHabitsAndEntries([], new Map())
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().todayPercentage.value).toBe(0)
  })

  it('todayCompleted counts completed habits for current day', async () => {
    // useNow mock -> Mar 1 = day 11 of Ramadan (Feb 19 start)
    const habits = [makeHabit('h1'), makeHabit('h2'), makeHabit('h3')]
    const entries = new Map([['h1-11', true], ['h3-11', true]])
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    const { todayCompleted, todayPercentage } = useStats()
    expect(todayCompleted.value).toBe(2)
    expect(todayPercentage.value).toBe(67) // Math.round(2/3*100)
  })

  it('todayCompleted is 0 when currentDay is 0 (before Ramadan)', async () => {
    const habits = [makeHabit('h1')]
    const entries = new Map([['h1-1', true]])
    // Dev date before Ramadan -> currentDay=0
    setupWithDevDate(habits, entries, '2026-02-10')
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().todayCompleted.value).toBe(0)
  })

  it('overallPercentage is 0 when no habits exist', async () => {
    setupHabitsAndEntries([], new Map())
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().overallPercentage.value).toBe(0)
  })

  it('overallPercentage calculates correctly', async () => {
    const habits = [makeHabit('h1', 10)]
    const entries = new Map<string, boolean>()
    for (let d = 1; d <= 5; d++) entries.set(`h1-${d}`, true)
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().overallPercentage.value).toBe(50)
  })

  it('habitStats returns correct structure', async () => {
    const habits = [makeHabit('h1', 30)]
    const entries = new Map([['h1-1', true], ['h1-2', true]])
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().habitStats.value[0]).toMatchObject({
      habitId: 'h1',
      target: 30,
      completed: 2,
      remaining: 28,
    })
  })

  it('habitStats percentage with zero target', async () => {
    const habits = [makeHabit('h1', 0)]
    setupHabitsAndEntries(habits, new Map())
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().habitStats.value[0]?.percentage).toBe(0)
  })

  it('overallCompleted sums all habit completions', async () => {
    const habits = [makeHabit('h1'), makeHabit('h2')]
    const entries = new Map([['h1-1', true], ['h2-1', true], ['h2-2', true]])
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().overallCompleted.value).toBe(3)
  })

  it('overallTarget sums all habit targets', async () => {
    const habits = [makeHabit('h1', 30), makeHabit('h2', 20)]
    setupHabitsAndEntries(habits, new Map())
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().overallTarget.value).toBe(50)
  })

  it('dailyCompletionData returns correct array', async () => {
    const habits = [makeHabit('h1')]
    const entries = new Map([['h1-1', true]])
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    const data = useStats().dailyCompletionData()
    expect(data[0]).toMatchObject({ day: 1, percentage: 100 })
  })

  it('dailyCompletionData with no completed habits shows 0%', async () => {
    setupHabitsAndEntries([makeHabit('h1')], new Map())
    const { useStats } = await import('~/composables/useStats')
    const data = useStats().dailyCompletionData()
    expect(data[0]?.percentage).toBe(0)
  })

  it('dailyCompletionData with no habits shows 0%', async () => {
    setupHabitsAndEntries([], new Map())
    const { useStats } = await import('~/composables/useStats')
    const data = useStats().dailyCompletionData()
    expect(data[0]?.percentage).toBe(0)
  })

  it('streak is 0 when currentDay is 0', async () => {
    setupWithDevDate([], new Map(), '2026-02-10')
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().streak.value).toBe(0)
  })

  it('streak counts consecutive completed days', async () => {
    const habits = [makeHabit('h1')]
    const entries = new Map<string, boolean>()
    // currentDay = 11 (Mar 1 - Feb 19 + 1)
    for (let d = 9; d <= 11; d++) entries.set(`h1-${d}`, true)
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().streak.value).toBe(3)
  })

  it('streak breaks when a day is not completed', async () => {
    const habits = [makeHabit('h1')]
    const entries = new Map<string, boolean>()
    // Day 11 and 10 completed, but 9 not -> streak = 2
    entries.set('h1-11', true)
    entries.set('h1-10', true)
    // Day 9 missing
    entries.set('h1-8', true)
    setupHabitsAndEntries(habits, entries)
    const { useStats } = await import('~/composables/useStats')
    expect(useStats().streak.value).toBe(2)
  })

  it('streak is 0 when no habits exist but currentDay > 0', async () => {
    setupHabitsAndEntries([], new Map())
    const { useStats } = await import('~/composables/useStats')
    // No habits -> allDone is true but habits.length is 0 -> streak stays 0
    expect(useStats().streak.value).toBe(0)
  })
})
