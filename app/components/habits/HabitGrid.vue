<script setup lang="ts">
import { RAMADAN_DAYS, HABIT_CATEGORIES } from '~/utils/constants'

const { t } = useI18n()
const { habits, isCompleted, toggleEntry, getHabitName } = useHabits()
const { currentDay } = useRamadanDay()

const days = Array.from({ length: RAMADAN_DAYS }, (_, i) => i + 1)

const groupedHabits = computed(() => {
  const groups: { category: string; habits: typeof habits.value }[] = []
  for (const cat of HABIT_CATEGORIES) {
    const catHabits = habits.value.filter((h) => h.category === cat)
    if (catHabits.length > 0) {
      groups.push({ category: cat, habits: catHabits })
    }
  }
  return groups
})
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b">
              <th class="sticky left-0 z-10 bg-card px-3 py-2 text-left font-medium min-w-[160px]">
                {{ t('habits.title') }}
              </th>
              <th
                v-for="day in days"
                :key="day"
                class="min-w-[36px] px-1 py-2 text-center font-medium"
                :class="day === currentDay ? 'bg-primary/10' : ''"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="group in groupedHabits" :key="group.category">
              <HabitsHabitCategoryHeader :category="group.category" :col-span="RAMADAN_DAYS + 1" />
              <HabitsHabitRow
                v-for="habit in group.habits"
                :key="habit.id"
                :habit="habit"
                :days="days"
                :current-day="currentDay"
                :is-completed="isCompleted"
                :get-habit-name="getHabitName"
                @toggle="toggleEntry"
              />
            </template>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
