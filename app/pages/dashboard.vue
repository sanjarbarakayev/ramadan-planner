<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { fetchHabits, fetchEntries } = useHabits()
const { fetchProgress } = useQuranProgress()

onMounted(async () => {
  await Promise.all([fetchHabits(), fetchEntries(), fetchProgress()])
})
</script>

<template>
  <div class="space-y-6">
    <DashboardQuickStats />
    <DashboardIftarCountdown />

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-6">
        <DashboardDailyProgress />
        <DashboardPrayerTimes />
        <DashboardSahurIftarDuas />
        <DashboardDailyTasks />
      </div>
      <div class="space-y-6">
        <DashboardQuranTracker />
        <DashboardDailyZikr />
      </div>
    </div>
  </div>
</template>
