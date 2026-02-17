export type GoalCategory = 'quran' | 'prayer' | 'charity' | 'personal' | 'general'

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string
  completed: boolean
  category: GoalCategory
  priority: number
  target_date: string | null
  ramadan_day: number | null
  sort_order: number
  created_at: string
}

export interface CreateGoalInput {
  title: string
  category?: GoalCategory
  description?: string
  priority?: number
  target_date?: string | null
  ramadan_day?: number | null
}

export function useGoals() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { currentDay } = useRamadanDay()

  const goals = useState<Goal[]>('goals', () => [])
  const loading = ref(false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  async function fetchGoals() {
    const userId = getUserId()
    if (!userId) return

    loading.value = true
    const { data } = await client
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')

    goals.value = (data ?? []) as Goal[]
    loading.value = false
  }

  async function addGoal(input: CreateGoalInput) {
    const userId = getUserId()
    if (!userId || !input.title.trim()) return

    const { data, error } = await client
      .from('goals')
      .insert({
        user_id: userId,
        title: input.title.trim(),
        category: input.category ?? 'general',
        description: input.description ?? '',
        priority: input.priority ?? 0,
        target_date: input.target_date ?? null,
        ramadan_day: input.ramadan_day ?? null,
      })
      .select()
      .single()

    if (!error && data) {
      goals.value = [...goals.value, data as Goal]
    }
  }

  async function toggleGoal(goalId: string) {
    const userId = getUserId()
    if (!userId) return

    const goal = goals.value.find((g) => g.id === goalId)
    if (!goal) return

    const newCompleted = !goal.completed

    // Optimistic update (immutable)
    goals.value = goals.value.map((g) =>
      g.id === goalId ? { ...g, completed: newCompleted } : g
    )

    const { error } = await client
      .from('goals')
      .update({ completed: newCompleted })
      .eq('id', goalId)

    if (error) {
      // Rollback (immutable)
      goals.value = goals.value.map((g) =>
        g.id === goalId ? { ...g, completed: !newCompleted } : g
      )
    }
  }

  async function deleteGoal(goalId: string) {
    const userId = getUserId()
    if (!userId) return

    const previous = goals.value

    // Optimistic remove
    goals.value = goals.value.filter((g) => g.id !== goalId)

    const { error } = await client
      .from('goals')
      .delete()
      .eq('id', goalId)

    if (error) {
      goals.value = previous
    }
  }

  async function updateGoal(goalId: string, updates: Partial<Goal>) {
    const { data, error } = await client
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single()

    if (!error && data) {
      goals.value = goals.value.map((g) =>
        g.id === goalId ? (data as Goal) : g
      )
    }
  }

  const completedCount = computed(() =>
    goals.value.filter((g) => g.completed).length
  )

  const totalCount = computed(() => goals.value.length)

  const completionPercentage = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.round((completedCount.value / totalCount.value) * 100)
  })

  const goalsByCategory = computed(() => {
    const grouped: Record<GoalCategory, Goal[]> = {
      quran: [],
      prayer: [],
      charity: [],
      personal: [],
      general: [],
    }
    for (const goal of goals.value) {
      const cat = goal.category || 'general'
      if (grouped[cat]) {
        grouped[cat] = [...grouped[cat], goal]
      }
    }
    return grouped
  })

  const todayGoals = computed(() =>
    goals.value.filter((g) =>
      g.ramadan_day === currentDay.value || g.ramadan_day === null
    )
  )

  return {
    goals: readonly(goals),
    loading: readonly(loading),
    fetchGoals,
    addGoal,
    toggleGoal,
    deleteGoal,
    updateGoal,
    completedCount,
    totalCount,
    completionPercentage,
    goalsByCategory,
    todayGoals,
  }
}
