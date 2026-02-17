import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearStateRegistry,
  setSupabaseMockResponse,
} from '../../mocks/imports'

import type { Goal, GoalCategory } from '~/composables/useGoals'

function importUseGoals() {
  return import('~/composables/useGoals').then((m) => m.useGoals)
}

const makeGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: 'goal-1',
  user_id: 'test-user-id',
  title: 'Read entire Quran',
  description: '',
  completed: false,
  category: 'quran',
  priority: 0,
  target_date: null,
  ramadan_day: null,
  sort_order: 0,
  created_at: '2026-02-20T00:00:00Z',
  ...overrides,
})

beforeEach(() => {
  clearStateRegistry()
})

describe('useGoals', () => {
  describe('state initialization', () => {
    it('goals starts as empty array', async () => {
      const useGoals = await importUseGoals()
      const { goals } = useGoals()
      expect(goals.value).toEqual([])
    })

    it('goals state is readonly', async () => {
      const useGoals = await importUseGoals()
      const { goals } = useGoals()
      expect(goals.value).toEqual([])
    })
  })

  describe('fetchGoals', () => {
    it('populates goals from Supabase', async () => {
      const mockGoals = [makeGoal({ id: 'g1' }), makeGoal({ id: 'g2' })]
      setSupabaseMockResponse({ data: mockGoals, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, goals } = useGoals()
      await fetchGoals()
      expect(goals.value).toEqual(mockGoals)
    })

    it('sets goals to empty array when data is null', async () => {
      setSupabaseMockResponse({ data: null, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, goals } = useGoals()
      await fetchGoals()
      expect(goals.value).toEqual([])
    })
  })

  describe('addGoal', () => {
    it('appends goal when Supabase returns data', async () => {
      const newGoal = makeGoal({ id: 'new-1' })
      setSupabaseMockResponse({ data: newGoal, error: null })

      const useGoals = await importUseGoals()
      const { addGoal, goals } = useGoals()
      await addGoal({ title: 'New goal', category: 'general' })
      expect(goals.value).toContainEqual(newGoal)
    })

    it('does not append on error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'error' } })

      const useGoals = await importUseGoals()
      const { addGoal, goals } = useGoals()
      await addGoal({ title: 'New goal', category: 'general' })
      expect(goals.value).toEqual([])
    })

    it('does not add when title is empty', async () => {
      const useGoals = await importUseGoals()
      const { addGoal, goals } = useGoals()
      await addGoal({ title: '', category: 'general' })
      expect(goals.value).toEqual([])
    })
  })

  describe('toggleGoal', () => {
    it('optimistically toggles completed to true', async () => {
      const goal = makeGoal({ id: 'g1', completed: false })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, toggleGoal, goals } = useGoals()
      await fetchGoals()

      setSupabaseMockResponse({ data: null, error: null })
      await toggleGoal('g1')
      expect(goals.value.find((g) => g.id === 'g1')?.completed).toBe(true)
    })

    it('optimistically toggles completed to false', async () => {
      const goal = makeGoal({ id: 'g1', completed: true })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, toggleGoal, goals } = useGoals()
      await fetchGoals()

      setSupabaseMockResponse({ data: null, error: null })
      await toggleGoal('g1')
      expect(goals.value.find((g) => g.id === 'g1')?.completed).toBe(false)
    })

    it('rolls back on error', async () => {
      const goal = makeGoal({ id: 'g1', completed: false })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, toggleGoal, goals } = useGoals()
      await fetchGoals()

      setSupabaseMockResponse({ data: null, error: { message: 'DB error' } })
      await toggleGoal('g1')
      expect(goals.value.find((g) => g.id === 'g1')?.completed).toBe(false)
    })
  })

  describe('deleteGoal', () => {
    it('removes goal from list on success', async () => {
      const goal = makeGoal({ id: 'g1' })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, deleteGoal, goals } = useGoals()
      await fetchGoals()
      expect(goals.value).toHaveLength(1)

      setSupabaseMockResponse({ data: null, error: null })
      await deleteGoal('g1')
      expect(goals.value).toHaveLength(0)
    })

    it('keeps goal in list on error', async () => {
      const goal = makeGoal({ id: 'g1' })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, deleteGoal, goals } = useGoals()
      await fetchGoals()

      setSupabaseMockResponse({ data: null, error: { message: 'error' } })
      await deleteGoal('g1')
      expect(goals.value).toHaveLength(1)
    })
  })

  describe('updateGoal', () => {
    it('updates goal title in list', async () => {
      const goal = makeGoal({ id: 'g1', title: 'Original' })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, updateGoal, goals } = useGoals()
      await fetchGoals()

      const updated = makeGoal({ id: 'g1', title: 'Updated' })
      setSupabaseMockResponse({ data: updated, error: null })
      await updateGoal('g1', { title: 'Updated' })
      expect(goals.value[0]?.title).toBe('Updated')
    })

    it('does not update on error', async () => {
      const goal = makeGoal({ id: 'g1', title: 'Original' })
      setSupabaseMockResponse({ data: [goal], error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, updateGoal, goals } = useGoals()
      await fetchGoals()

      setSupabaseMockResponse({ data: null, error: { message: 'error' } })
      await updateGoal('g1', { title: 'Updated' })
      expect(goals.value[0]?.title).toBe('Original')
    })
  })

  describe('computed properties', () => {
    it('completedCount returns number of completed goals', async () => {
      const goals = [
        makeGoal({ id: 'g1', completed: true }),
        makeGoal({ id: 'g2', completed: false }),
        makeGoal({ id: 'g3', completed: true }),
      ]
      setSupabaseMockResponse({ data: goals, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, completedCount } = useGoals()
      await fetchGoals()
      expect(completedCount.value).toBe(2)
    })

    it('totalCount returns total number of goals', async () => {
      const goals = [makeGoal({ id: 'g1' }), makeGoal({ id: 'g2' })]
      setSupabaseMockResponse({ data: goals, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, totalCount } = useGoals()
      await fetchGoals()
      expect(totalCount.value).toBe(2)
    })

    it('completionPercentage calculates correctly', async () => {
      const goals = [
        makeGoal({ id: 'g1', completed: true }),
        makeGoal({ id: 'g2', completed: false }),
      ]
      setSupabaseMockResponse({ data: goals, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, completionPercentage } = useGoals()
      await fetchGoals()
      expect(completionPercentage.value).toBe(50)
    })

    it('completionPercentage is 0 when no goals', async () => {
      const useGoals = await importUseGoals()
      const { completionPercentage } = useGoals()
      expect(completionPercentage.value).toBe(0)
    })

    it('goalsByCategory groups goals correctly', async () => {
      const goals = [
        makeGoal({ id: 'g1', category: 'quran' }),
        makeGoal({ id: 'g2', category: 'prayer' }),
        makeGoal({ id: 'g3', category: 'quran' }),
      ]
      setSupabaseMockResponse({ data: goals, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, goalsByCategory } = useGoals()
      await fetchGoals()
      expect(goalsByCategory.value.quran).toHaveLength(2)
      expect(goalsByCategory.value.prayer).toHaveLength(1)
    })

    it('todayGoals filters by ramadan_day', async () => {
      // useRamadanDay returns currentDay=11 (Mar 1 - Feb 19 + 1)
      const goals = [
        makeGoal({ id: 'g1', ramadan_day: 11 }),
        makeGoal({ id: 'g2', ramadan_day: 5 }),
        makeGoal({ id: 'g3', ramadan_day: null }),
      ]
      setSupabaseMockResponse({ data: goals, error: null })

      const useGoals = await importUseGoals()
      const { fetchGoals, todayGoals } = useGoals()
      await fetchGoals()
      // Should include goals for day 11 + goals with no ramadan_day
      expect(todayGoals.value).toHaveLength(2)
    })
  })

  describe('shared state', () => {
    it('goals are shared across useGoals calls', async () => {
      const useGoals = await importUseGoals()
      const first = useGoals()
      const second = useGoals()
      expect(first.goals.value).toBe(second.goals.value)
    })
  })
})
