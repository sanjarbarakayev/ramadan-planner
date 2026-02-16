export interface Habit {
  id: string
  user_id: string
  name_uz: string
  name_ru: string
  name_en: string
  category: string
  target_days: number
  sort_order: number
  is_custom: boolean
  is_active: boolean
}

export interface HabitEntry {
  id: string
  user_id: string
  habit_id: string
  ramadan_day: number
  completed: boolean
  date: string | null
}

export function useHabits() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { locale } = useI18n()

  const habits = useState<Habit[]>('habits', () => [])
  const entries = useState<Map<string, boolean>>('habitEntries', () => new Map())
  const loading = ref(false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  function entryKey(habitId: string, day: number): string {
    return `${habitId}-${day}`
  }

  function getHabitName(habit: Habit): string {
    switch (locale.value) {
      case 'ru': return habit.name_ru || habit.name_uz
      case 'en': return habit.name_en || habit.name_uz
      default: return habit.name_uz
    }
  }

  async function fetchHabits() {
    const userId = getUserId()
    if (!userId) return
    loading.value = true

    const { data } = await client
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('sort_order')

    habits.value = (data ?? []) as Habit[]
    loading.value = false
  }

  async function fetchEntries() {
    const userId = getUserId()
    if (!userId) return

    const { data } = await client
      .from('habit_entries')
      .select('*')
      .eq('user_id', userId)

    const map = new Map<string, boolean>()
    for (const entry of (data ?? []) as HabitEntry[]) {
      map.set(entryKey(entry.habit_id, entry.ramadan_day), entry.completed)
    }
    entries.value = map
  }

  function isCompleted(habitId: string, day: number): boolean {
    return entries.value.get(entryKey(habitId, day)) ?? false
  }

  async function toggleEntry(habitId: string, day: number) {
    const userId = getUserId()
    if (!userId) return

    const key = entryKey(habitId, day)
    const current = entries.value.get(key) ?? false
    const newValue = !current

    // Optimistic update
    const newMap = new Map(entries.value)
    newMap.set(key, newValue)
    entries.value = newMap

    if (newValue) {
      const { error } = await client
        .from('habit_entries')
        .upsert({
          user_id: userId,
          habit_id: habitId,
          ramadan_day: day,
          completed: true,
        }, {
          onConflict: 'habit_id,ramadan_day',
        })

      if (error) {
        // Rollback
        const rollback = new Map(entries.value)
        rollback.set(key, current)
        entries.value = rollback
      }
    } else {
      const { error } = await client
        .from('habit_entries')
        .delete()
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .eq('ramadan_day', day)

      if (error) {
        const rollback = new Map(entries.value)
        rollback.set(key, current)
        entries.value = rollback
      }
    }
  }

  async function addHabit(habit: {
    name_uz: string
    name_ru: string
    name_en: string
    category: string
    target_days: number
  }) {
    const userId = getUserId()
    if (!userId) return

    const maxOrder = habits.value.reduce((max, h) => Math.max(max, h.sort_order), 0)

    const { data, error } = await client
      .from('habits')
      .insert({
        user_id: userId,
        ...habit,
        sort_order: maxOrder + 1,
        is_custom: true,
        is_active: true,
      })
      .select()
      .single()

    if (!error && data) {
      habits.value = [...habits.value, data as Habit]
    }
  }

  async function updateHabit(id: string, updates: Partial<Habit>) {
    const { data, error } = await client
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      habits.value = habits.value.map((h) =>
        h.id === id ? (data as Habit) : h
      )
    }
  }

  async function deleteHabit(id: string) {
    const { error } = await client
      .from('habits')
      .delete()
      .eq('id', id)

    if (!error) {
      habits.value = habits.value.filter((h) => h.id !== id)
    }
  }

  return {
    habits: readonly(habits),
    entries: readonly(entries),
    loading: readonly(loading),
    fetchHabits,
    fetchEntries,
    isCompleted,
    toggleEntry,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitName,
  }
}
