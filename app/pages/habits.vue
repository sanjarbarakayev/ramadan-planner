<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { t } = useI18n()
const { fetchHabits, fetchEntries } = useHabits()

onMounted(async () => {
  await Promise.all([fetchHabits(), fetchEntries()])
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('habits.title') }}</h1>
      <HabitsAddHabitDialog />
    </div>

    <HabitsHabitGrid />

    <div class="grid gap-6 lg:grid-cols-2">
      <HabitsHabitStats />
      <HabitsProgressChart />
    </div>
  </div>
</template>
