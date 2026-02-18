<script setup lang="ts">
import { RAMADAN_DAYS, HABIT_CATEGORIES } from '~/utils/constants'

const { t } = useI18n()
const { habits, loading, isCompleted, toggleEntry, getHabitName } = useHabits()
const { currentDay } = useRamadanDay()
const { showError } = useAppToast()

const showUncheckConfirm = ref(false)
const pendingUncheck = ref<{ habitId: string; day: number } | null>(null)

function handleToggle(habitId: string, day: number) {
  if (isCompleted(habitId, day)) {
    pendingUncheck.value = { habitId, day }
    showUncheckConfirm.value = true
    return
  }
  doToggle(habitId, day)
}

async function confirmUncheck() {
  if (pendingUncheck.value) {
    await doToggle(pendingUncheck.value.habitId, pendingUncheck.value.day)
  }
  pendingUncheck.value = null
  showUncheckConfirm.value = false
}

function cancelUncheck() {
  pendingUncheck.value = null
  showUncheckConfirm.value = false
}

async function doToggle(habitId: string, day: number) {
  const result = await toggleEntry(habitId, day)
  if (!result.ok) {
    showError('toast.habitToggleError')
  }
}

const days = Array.from({ length: RAMADAN_DAYS }, (_, i) => i + 1)

const scrollContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    const el = scrollContainer.value
    if (!el || !currentDay.value) return
    const dayColumnWidth = 36
    const stickyColumnWidth = 120
    const targetScroll = (currentDay.value - 1) * dayColumnWidth - (el.clientWidth - stickyColumnWidth) / 2
    el.scrollLeft = Math.max(0, targetScroll)
  })
})

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
      <div v-if="loading" class="p-4 space-y-3">
        <Skeleton class="h-5 w-24" />
        <div v-for="i in 5" :key="i" class="flex items-center gap-2">
          <Skeleton class="h-4 w-28 shrink-0" />
          <div class="flex gap-1">
            <Skeleton v-for="j in 10" :key="j" class="h-6 w-6 rounded" />
          </div>
        </div>
      </div>
      <div v-else ref="scrollContainer" class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b">
              <th class="sticky left-0 z-10 bg-card px-3 py-2 text-left font-medium min-w-[120px]">
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
                @toggle="handleToggle"
              />
            </template>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>

  <AlertDialog :open="showUncheckConfirm" @update:open="cancelUncheck">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ t('habits.uncheckConfirmTitle') }}</AlertDialogTitle>
        <AlertDialogDescription>{{ t('habits.uncheckConfirmMessage') }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="cancelUncheck">{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="confirmUncheck">{{ t('common.confirm') }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
