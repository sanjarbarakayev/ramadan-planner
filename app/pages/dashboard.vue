<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { fetchHabits, fetchEntries } = useHabits()
const { fetchProgress } = useQuranProgress()
const { fetchPrayerEntries } = usePrayerEntries()
const { fetchTasks } = useDailyTasks()

onMounted(async () => {
  await Promise.all([fetchHabits(), fetchEntries(), fetchProgress(), fetchPrayerEntries(), fetchTasks()])
})
</script>

<template>
  <div class="space-y-6">
    <DashboardMotivationalBanner />
    <DashboardQuickStats />
    <DashboardIftarCountdown />

    <SharedSectionDivider />

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-6">
        <DashboardDailyProgress />
        <DashboardPrayerStreak />
        <DashboardSahurIftarDuas />
        <DashboardDailyTasks />
      </div>
      <div class="space-y-6">
        <DashboardQuranTracker />
        <DashboardPrayerTimes />
        <DashboardDailyZikr />
      </div>
    </div>
  </div>
</template>
