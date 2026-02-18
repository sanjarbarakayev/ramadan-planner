<script setup lang="ts">
import type { Habit } from '~/composables/useHabits'

const props = defineProps<{
  habit: Habit
  days: number[]
  currentDay: number
  isCompleted: (habitId: string, day: number) => boolean
  getHabitName: (habit: Habit) => string
}>()

const emit = defineEmits<{
  toggle: [habitId: string, day: number]
}>()

const showEdit = ref(false)
</script>

<template>
  <tr class="border-b hover:bg-muted/30">
    <td class="sticky left-0 z-10 bg-card px-3 py-1.5">
      <button
        class="text-left text-sm hover:text-primary truncate max-w-[100px] sm:max-w-[150px] block"
        @click="showEdit = true"
      >
        {{ getHabitName(habit) }}
      </button>
      <HabitsEditHabitDialog
        v-if="showEdit"
        :habit="habit"
        @close="showEdit = false"
      />
    </td>
    <td
      v-for="day in days"
      :key="day"
      class="px-1 py-1 text-center"
      :class="day === currentDay ? 'bg-primary/10' : ''"
    >
      <button
        class="inline-flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded border transition-colors"
        :class="[
          isCompleted(habit.id, day)
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-input',
          day === currentDay && !isCompleted(habit.id, day) ? 'hover:border-primary/50' : '',
          day !== currentDay ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        :disabled="day !== currentDay"
        :aria-label="`${getHabitName(habit)} - ${$t('habits.day')} ${day}: ${isCompleted(habit.id, day) ? $t('habits.completed') : $t('habits.notCompleted')}`"
        :aria-pressed="isCompleted(habit.id, day)"
        @click="day === currentDay && emit('toggle', habit.id, day)"
      >
        <svg
          v-if="isCompleted(habit.id, day)"
          class="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </td>
  </tr>
</template>
