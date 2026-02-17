import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearStateRegistry,
  setSupabaseMockResponse,
  setMockLocale,
} from '../../mocks/imports'

import { useHabits, type Habit } from '~/composables/useHabits'

const makeHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: 'habit-1',
  user_id: 'test-user-id',
  name_uz: 'Test UZ',
  name_ru: 'Test RU',
  name_en: 'Test EN',
  category: 'worship',
  target_days: 30,
  sort_order: 1,
  is_custom: false,
  is_active: true,
  ...overrides,
})

beforeEach(() => {
  clearStateRegistry()
})

describe('useHabits', () => {
  describe('getHabitName', () => {
    it('returns name_en for English locale', () => {
      const { getHabitName } = useHabits()
      expect(getHabitName(makeHabit())).toBe('Test EN')
    })

    it('returns name_uz fallback when name_en is empty', () => {
      const { getHabitName } = useHabits()
      expect(getHabitName(makeHabit({ name_en: '', name_uz: 'Fallback' }))).toBe('Fallback')
    })

    it('returns name_ru for Russian locale', () => {
      setMockLocale('ru')
      const { getHabitName } = useHabits()
      expect(getHabitName(makeHabit())).toBe('Test RU')
    })

    it('returns name_uz fallback when name_ru is empty and locale is ru', () => {
      setMockLocale('ru')
      const { getHabitName } = useHabits()
      expect(getHabitName(makeHabit({ name_ru: '', name_uz: 'UZ Fallback' }))).toBe('UZ Fallback')
    })

    it('returns name_uz for uz locale', () => {
      setMockLocale('uz')
      const { getHabitName } = useHabits()
      expect(getHabitName(makeHabit({ name_uz: 'Namoz' }))).toBe('Namoz')
    })

    it('returns name_uz for any other locale', () => {
      setMockLocale('fr')
      const { getHabitName } = useHabits()
      expect(getHabitName(makeHabit({ name_uz: 'Default UZ' }))).toBe('Default UZ')
    })
  })

  describe('state initialization', () => {
    it('habits starts as empty array', () => {
      const { habits } = useHabits()
      expect(habits.value).toEqual([])
    })

    it('entries starts as empty Map', () => {
      const { entries } = useHabits()
      expect(entries.value).toBeInstanceOf(Map)
      expect(entries.value.size).toBe(0)
    })

    it('loading starts as false', () => {
      const { loading } = useHabits()
      expect(loading.value).toBe(false)
    })
  })

  describe('isCompleted', () => {
    it('returns false for non-existent entry', () => {
      const { isCompleted } = useHabits()
      expect(isCompleted('unknown', 1)).toBe(false)
    })
  })

  describe('fetchHabits', () => {
    it('sets habits from Supabase response', async () => {
      const mockHabits = [makeHabit({ id: 'h1' }), makeHabit({ id: 'h2' })]
      setSupabaseMockResponse({ data: mockHabits, error: null })

      const { fetchHabits, habits } = useHabits()
      await fetchHabits()
      expect(habits.value).toEqual(mockHabits)
    })

    it('sets habits to empty array when data is null', async () => {
      setSupabaseMockResponse({ data: null, error: null })

      const { fetchHabits, habits } = useHabits()
      await fetchHabits()
      expect(habits.value).toEqual([])
    })

    it('sets loading to false after fetch', async () => {
      const { fetchHabits, loading } = useHabits()
      await fetchHabits()
      expect(loading.value).toBe(false)
    })
  })

  describe('fetchEntries', () => {
    it('populates entries map from Supabase response', async () => {
      const mockEntries = [
        { id: 'e1', user_id: 'test-user-id', habit_id: 'h1', ramadan_day: 1, completed: true, date: null },
        { id: 'e2', user_id: 'test-user-id', habit_id: 'h1', ramadan_day: 2, completed: true, date: null },
      ]
      setSupabaseMockResponse({ data: mockEntries, error: null })

      const { fetchEntries, entries } = useHabits()
      await fetchEntries()
      expect(entries.value.size).toBe(2)
      expect(entries.value.get('h1-1')).toBe(true)
      expect(entries.value.get('h1-2')).toBe(true)
    })

    it('handles null data gracefully', async () => {
      setSupabaseMockResponse({ data: null, error: null })

      const { fetchEntries, entries } = useHabits()
      await fetchEntries()
      expect(entries.value.size).toBe(0)
    })
  })

  describe('toggleEntry', () => {
    it('optimistically sets entry to true', async () => {
      const { toggleEntry, entries } = useHabits()
      await toggleEntry('h1', 5)
      expect(entries.value.get('h1-5')).toBe(true)
    })

    it('optimistically sets entry to false when toggling off', async () => {
      // Pre-populate entries so the toggle goes from true -> false
      const { toggleEntry, entries } = useHabits()
      // First toggle: false -> true
      await toggleEntry('h1', 5)
      expect(entries.value.get('h1-5')).toBe(true)
      // Second toggle: true -> false
      await toggleEntry('h1', 5)
      expect(entries.value.get('h1-5')).toBe(false)
    })

    it('rolls back on upsert error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'DB error' } })

      const { toggleEntry, entries } = useHabits()
      await toggleEntry('h1', 3)
      // Should rollback to false (original value)
      expect(entries.value.get('h1-3')).toBe(false)
    })

    it('rolls back on delete error (toggle off path)', async () => {
      const { toggleEntry, entries } = useHabits()

      // First toggle on (success)
      setSupabaseMockResponse({ data: null, error: null })
      await toggleEntry('h1', 7)
      expect(entries.value.get('h1-7')).toBe(true)

      // Second toggle off with error -> rollback to true
      setSupabaseMockResponse({ data: null, error: { message: 'Delete failed' } })
      await toggleEntry('h1', 7)
      expect(entries.value.get('h1-7')).toBe(true) // rolled back
    })
  })

  describe('addHabit', () => {
    it('appends habit when Supabase returns data', async () => {
      const newHabit = makeHabit({ id: 'new-1', sort_order: 1 })
      setSupabaseMockResponse({ data: newHabit, error: null })

      const { addHabit, habits } = useHabits()
      await addHabit({
        name_uz: 'New',
        name_ru: 'New',
        name_en: 'New',
        category: 'worship',
        target_days: 30,
      })
      expect(habits.value).toContainEqual(newHabit)
    })

    it('does not append on error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'error' } })

      const { addHabit, habits } = useHabits()
      await addHabit({
        name_uz: 'New',
        name_ru: 'New',
        name_en: 'New',
        category: 'worship',
        target_days: 30,
      })
      expect(habits.value).toEqual([])
    })
  })

  describe('updateHabit', () => {
    it('updates habit in list when Supabase returns data', async () => {
      const original = makeHabit({ id: 'h1' })
      const updated = makeHabit({ id: 'h1', name_en: 'Updated' })

      // First set up some habits
      setSupabaseMockResponse({ data: [original], error: null })
      const { fetchHabits, updateHabit, habits } = useHabits()
      await fetchHabits()

      // Now update
      setSupabaseMockResponse({ data: updated, error: null })
      await updateHabit('h1', { name_en: 'Updated' })
      expect(habits.value[0]?.name_en).toBe('Updated')
    })

    it('does not update on error', async () => {
      const original = makeHabit({ id: 'h1' })
      setSupabaseMockResponse({ data: [original], error: null })
      const { fetchHabits, updateHabit, habits } = useHabits()
      await fetchHabits()

      setSupabaseMockResponse({ data: null, error: { message: 'error' } })
      await updateHabit('h1', { name_en: 'Updated' })
      expect(habits.value[0]?.name_en).toBe('Test EN')
    })
  })

  describe('deleteHabit', () => {
    it('removes habit from list on success', async () => {
      const habit = makeHabit({ id: 'h1' })
      setSupabaseMockResponse({ data: [habit], error: null })
      const { fetchHabits, deleteHabit, habits } = useHabits()
      await fetchHabits()
      expect(habits.value).toHaveLength(1)

      setSupabaseMockResponse({ data: null, error: null })
      await deleteHabit('h1')
      expect(habits.value).toHaveLength(0)
    })

    it('keeps habit in list on error', async () => {
      const habit = makeHabit({ id: 'h1' })
      setSupabaseMockResponse({ data: [habit], error: null })
      const { fetchHabits, deleteHabit, habits } = useHabits()
      await fetchHabits()

      setSupabaseMockResponse({ data: null, error: { message: 'error' } })
      await deleteHabit('h1')
      expect(habits.value).toHaveLength(1)
    })
  })

  describe('shared state', () => {
    it('habits are shared across useHabits calls', () => {
      const first = useHabits()
      const second = useHabits()
      expect(first.habits.value).toBe(second.habits.value)
    })

    it('entries are shared across useHabits calls', () => {
      const first = useHabits()
      const second = useHabits()
      expect(first.entries.value).toBe(second.entries.value)
    })
  })
})
