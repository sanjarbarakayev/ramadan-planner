import { dailyTaskSchema } from '~/utils/validation'
import { success, failure } from '~/types/result'
import type { OperationResult } from '~/types/result'

export interface DailyTask {
  id: string
  user_id: string
  title: string
  completed: boolean
  sort_order: number
  ramadan_day: number
  created_at: string
}

export function useDailyTasks() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { currentDay } = useRamadanDay()

  const tasks = useState<DailyTask[]>('daily-tasks', () => [])
  const loading = useState<boolean>('daily-tasks-loading', () => false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  const completedCount = computed(() =>
    tasks.value.filter((t) => t.completed).length
  )

  const totalCount = computed(() => tasks.value.length)

  const completionPercentage = computed(() =>
    totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
  )

  async function fetchTasks(): Promise<void> {
    const userId = getUserId()
    if (!userId || currentDay.value === 0) return

    loading.value = true
    const { data } = await client
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('ramadan_day', currentDay.value)
      .order('sort_order')

    tasks.value = (data ?? []) as DailyTask[]
    loading.value = false
  }

  async function addTask(title: string): Promise<OperationResult<DailyTask>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')
    if (currentDay.value === 0) return failure('Not during Ramadan')

    const parsed = dailyTaskSchema.safeParse({ title: title.trim() })
    if (!parsed.success) return failure('Invalid task title')

    const optimisticTask: DailyTask = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      user_id: userId,
      title: parsed.data.title,
      completed: false,
      sort_order: tasks.value.length,
      ramadan_day: currentDay.value,
      created_at: new Date().toISOString(),
    }

    tasks.value = [...tasks.value, optimisticTask]

    const { data, error } = await client
      .from('daily_tasks')
      .insert({
        user_id: userId,
        ramadan_day: currentDay.value,
        title: parsed.data.title,
        sort_order: optimisticTask.sort_order,
      })
      .select()
      .single()

    if (error) {
      tasks.value = tasks.value.filter((t) => t.id !== optimisticTask.id)
      return failure(error.message)
    }

    const created = data as DailyTask
    tasks.value = tasks.value.map((t) =>
      t.id === optimisticTask.id ? created : t
    )
    return success(created)
  }

  async function toggleTask(taskId: string): Promise<OperationResult<boolean>> {
    const task = tasks.value.find((t) => t.id === taskId)
    if (!task) return failure('Task not found')

    const previous = task.completed
    const newCompleted = !previous

    tasks.value = tasks.value.map((t) =>
      t.id === taskId ? { ...t, completed: newCompleted } : t
    )

    const { error } = await client
      .from('daily_tasks')
      .update({ completed: newCompleted })
      .eq('id', taskId)

    if (error) {
      tasks.value = tasks.value.map((t) =>
        t.id === taskId ? { ...t, completed: previous } : t
      )
      return failure(error.message)
    }

    return success(newCompleted)
  }

  async function updateTaskTitle(taskId: string, title: string): Promise<OperationResult<void>> {
    const parsed = dailyTaskSchema.safeParse({ title: title.trim() })
    if (!parsed.success) return failure('Invalid task title')

    const trimmed = parsed.data.title

    const original = tasks.value.find((t) => t.id === taskId)?.title
    if (original === undefined) return failure('Task not found')

    tasks.value = tasks.value.map((t) =>
      t.id === taskId ? { ...t, title: trimmed } : t
    )

    const { error } = await client
      .from('daily_tasks')
      .update({ title: trimmed })
      .eq('id', taskId)

    if (error) {
      tasks.value = tasks.value.map((t) =>
        t.id === taskId ? { ...t, title: original } : t
      )
      return failure(error.message)
    }

    return success(undefined)
  }

  async function deleteTask(taskId: string): Promise<OperationResult<void>> {
    const removed = tasks.value.find((t) => t.id === taskId)
    if (!removed) return failure('Task not found')

    tasks.value = tasks.value.filter((t) => t.id !== taskId)

    const { error } = await client
      .from('daily_tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      tasks.value = [...tasks.value, removed]
      return failure(error.message)
    }

    return success(undefined)
  }

  return {
    tasks: readonly(tasks),
    loading: readonly(loading),
    completedCount,
    totalCount,
    completionPercentage,
    fetchTasks,
    addTask,
    toggleTask,
    updateTaskTitle,
    deleteTask,
  }
}
