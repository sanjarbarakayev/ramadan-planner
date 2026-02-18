import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearStateRegistry,
  setSupabaseMockResponse,
} from '../../mocks/imports'

import { useDailyTasks, type DailyTask } from '~/composables/useDailyTasks'

const makeTask = (overrides: Partial<DailyTask> = {}): DailyTask => ({
  id: 'task-1',
  user_id: 'test-user-id',
  title: 'Test Task',
  completed: false,
  sort_order: 0,
  ramadan_day: 11,
  created_at: '2026-03-01T12:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  clearStateRegistry()
})

describe('useDailyTasks', () => {
  describe('state initialization', () => {
    it('tasks starts as empty array', () => {
      const { tasks } = useDailyTasks()
      expect(tasks.value).toEqual([])
    })

    it('loading starts as false', () => {
      const { loading } = useDailyTasks()
      expect(loading.value).toBe(false)
    })
  })

  describe('computed properties', () => {
    it('completedCount returns number of completed tasks', async () => {
      const mockTasks = [
        makeTask({ id: 't1', completed: true }),
        makeTask({ id: 't2', completed: false }),
        makeTask({ id: 't3', completed: true }),
      ]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, completedCount } = useDailyTasks()
      await fetchTasks()
      expect(completedCount.value).toBe(2)
    })

    it('totalCount returns total number of tasks', async () => {
      const mockTasks = [
        makeTask({ id: 't1' }),
        makeTask({ id: 't2' }),
      ]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, totalCount } = useDailyTasks()
      await fetchTasks()
      expect(totalCount.value).toBe(2)
    })

    it('completionPercentage returns correct percentage', async () => {
      const mockTasks = [
        makeTask({ id: 't1', completed: true }),
        makeTask({ id: 't2', completed: false }),
        makeTask({ id: 't3', completed: true }),
        makeTask({ id: 't4', completed: false }),
      ]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, completionPercentage } = useDailyTasks()
      await fetchTasks()
      expect(completionPercentage.value).toBe(50)
    })

    it('completionPercentage returns 0 when no tasks', () => {
      const { completionPercentage } = useDailyTasks()
      expect(completionPercentage.value).toBe(0)
    })
  })

  describe('fetchTasks', () => {
    it('sets tasks from Supabase response', async () => {
      const mockTasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, tasks } = useDailyTasks()
      await fetchTasks()
      expect(tasks.value).toEqual(mockTasks)
    })

    it('sets tasks to empty array when data is null', async () => {
      setSupabaseMockResponse({ data: null, error: null })

      const { fetchTasks, tasks } = useDailyTasks()
      await fetchTasks()
      expect(tasks.value).toEqual([])
    })

    it('sets loading to false after fetch', async () => {
      setSupabaseMockResponse({ data: [], error: null })

      const { fetchTasks, loading } = useDailyTasks()
      await fetchTasks()
      expect(loading.value).toBe(false)
    })
  })

  describe('addTask', () => {
    it('appends task optimistically and replaces with server data', async () => {
      const serverTask = makeTask({ id: 'server-1', title: 'New Task' })
      setSupabaseMockResponse({ data: serverTask, error: null })

      const { addTask, tasks } = useDailyTasks()
      const result = await addTask('New Task')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data.id).toBe('server-1')
      }
      expect(tasks.value).toHaveLength(1)
      expect(tasks.value[0]?.title).toBe('New Task')
    })

    it('returns failure for empty title', async () => {
      const { addTask } = useDailyTasks()
      const result = await addTask('')
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Invalid task title')
      }
    })

    it('rolls back optimistic append on DB error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'DB error' } })

      const { addTask, tasks } = useDailyTasks()
      const result = await addTask('Failing Task')

      expect(result.ok).toBe(false)
      expect(tasks.value).toHaveLength(0)
    })
  })

  describe('toggleTask', () => {
    it('optimistically toggles task completion', async () => {
      const mockTasks = [makeTask({ id: 't1', completed: false })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, toggleTask, tasks } = useDailyTasks()
      await fetchTasks()

      setSupabaseMockResponse({ data: null, error: null })
      const result = await toggleTask('t1')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toBe(true)
      }
      expect(tasks.value[0]?.completed).toBe(true)
    })

    it('rolls back on DB error', async () => {
      const mockTasks = [makeTask({ id: 't1', completed: false })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, toggleTask, tasks } = useDailyTasks()
      await fetchTasks()

      setSupabaseMockResponse({ data: null, error: { message: 'Update failed' } })
      const result = await toggleTask('t1')

      expect(result.ok).toBe(false)
      expect(tasks.value[0]?.completed).toBe(false)
    })

    it('returns failure for non-existent task', async () => {
      const { toggleTask } = useDailyTasks()
      const result = await toggleTask('non-existent')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Task not found')
      }
    })
  })

  describe('updateTaskTitle', () => {
    it('optimistically updates title', async () => {
      const mockTasks = [makeTask({ id: 't1', title: 'Original' })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, updateTaskTitle, tasks } = useDailyTasks()
      await fetchTasks()

      setSupabaseMockResponse({ data: null, error: null })
      const result = await updateTaskTitle('t1', 'Updated')

      expect(result.ok).toBe(true)
      expect(tasks.value[0]?.title).toBe('Updated')
    })

    it('rolls back on DB error', async () => {
      const mockTasks = [makeTask({ id: 't1', title: 'Original' })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, updateTaskTitle, tasks } = useDailyTasks()
      await fetchTasks()

      setSupabaseMockResponse({ data: null, error: { message: 'Update failed' } })
      const result = await updateTaskTitle('t1', 'New Title')

      expect(result.ok).toBe(false)
      expect(tasks.value[0]?.title).toBe('Original')
    })

    it('returns failure for empty title', async () => {
      const { updateTaskTitle } = useDailyTasks()
      const result = await updateTaskTitle('t1', '  ')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Invalid task title')
      }
    })

    it('returns failure for non-existent task', async () => {
      const { updateTaskTitle } = useDailyTasks()
      const result = await updateTaskTitle('non-existent', 'Title')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Task not found')
      }
    })
  })

  describe('deleteTask', () => {
    it('optimistically removes task', async () => {
      const mockTasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, deleteTask, tasks } = useDailyTasks()
      await fetchTasks()
      expect(tasks.value).toHaveLength(2)

      setSupabaseMockResponse({ data: null, error: null })
      const result = await deleteTask('t1')

      expect(result.ok).toBe(true)
      expect(tasks.value).toHaveLength(1)
      expect(tasks.value[0]?.id).toBe('t2')
    })

    it('rolls back on DB error', async () => {
      const mockTasks = [makeTask({ id: 't1' })]
      setSupabaseMockResponse({ data: mockTasks, error: null })

      const { fetchTasks, deleteTask, tasks } = useDailyTasks()
      await fetchTasks()

      setSupabaseMockResponse({ data: null, error: { message: 'Delete failed' } })
      const result = await deleteTask('t1')

      expect(result.ok).toBe(false)
      expect(tasks.value).toHaveLength(1)
    })

    it('returns failure for non-existent task', async () => {
      const { deleteTask } = useDailyTasks()
      const result = await deleteTask('non-existent')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Task not found')
      }
    })
  })

  describe('shared state', () => {
    it('tasks are shared across useDailyTasks calls', () => {
      const first = useDailyTasks()
      const second = useDailyTasks()
      expect(first.tasks.value).toBe(second.tasks.value)
    })

    it('loading is shared across useDailyTasks calls', () => {
      const first = useDailyTasks()
      const second = useDailyTasks()
      expect(first.loading.value).toBe(second.loading.value)
    })
  })
})
