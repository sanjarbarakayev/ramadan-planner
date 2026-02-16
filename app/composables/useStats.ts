export interface HabitStat {
  habitId: string
  name: string
  target: number
  completed: number
  remaining: number
  percentage: number
}

export function useStats() {
  const { habits, entries, getHabitName } = useHabits()
  const { currentDay } = useRamadanDay()

  const habitStats = computed((): HabitStat[] => {
    return habits.value.map((habit) => {
      let completed = 0
      for (let day = 1; day <= 30; day++) {
        const key = `${habit.id}-${day}`
        if (entries.value.get(key)) {
          completed++
        }
      }
      const target = habit.target_days
      const remaining = Math.max(0, target - completed)
      const percentage = target > 0 ? Math.round((completed / target) * 100) : 0

      return {
        habitId: habit.id,
        name: getHabitName(habit),
        target,
        completed,
        remaining,
        percentage,
      }
    })
  })

  const todayCompleted = computed(() => {
    if (currentDay.value === 0) return 0
    let count = 0
    for (const habit of habits.value) {
      const key = `${habit.id}-${currentDay.value}`
      if (entries.value.get(key)) {
        count++
      }
    }
    return count
  })

  const todayTotal = computed(() => habits.value.length)

  const todayPercentage = computed(() => {
    if (todayTotal.value === 0) return 0
    return Math.round((todayCompleted.value / todayTotal.value) * 100)
  })

  const overallCompleted = computed(() =>
    habitStats.value.reduce((sum, s) => sum + s.completed, 0)
  )

  const overallTarget = computed(() =>
    habitStats.value.reduce((sum, s) => sum + s.target, 0)
  )

  const overallPercentage = computed(() => {
    if (overallTarget.value === 0) return 0
    return Math.round((overallCompleted.value / overallTarget.value) * 100)
  })

  const streak = computed(() => {
    if (currentDay.value === 0) return 0
    let streakCount = 0
    for (let day = currentDay.value; day >= 1; day--) {
      let allDone = true
      for (const habit of habits.value) {
        const key = `${habit.id}-${day}`
        if (!entries.value.get(key)) {
          allDone = false
          break
        }
      }
      if (allDone && habits.value.length > 0) {
        streakCount++
      } else {
        break
      }
    }
    return streakCount
  })

  function dailyCompletionData(): { day: number; percentage: number }[] {
    const data: { day: number; percentage: number }[] = []
    const maxDay = currentDay.value || 30
    for (let day = 1; day <= maxDay; day++) {
      let completed = 0
      for (const habit of habits.value) {
        const key = `${habit.id}-${day}`
        if (entries.value.get(key)) {
          completed++
        }
      }
      const total = habits.value.length
      data.push({
        day,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      })
    }
    return data
  }

  return {
    habitStats,
    todayCompleted,
    todayTotal,
    todayPercentage,
    overallCompleted,
    overallTarget,
    overallPercentage,
    streak,
    dailyCompletionData,
  }
}
