<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { fetchHabits, fetchEntries } = useHabits()
const { fetchProgress } = useQuranProgress()
const { fetchPrayerEntries } = usePrayerEntries()

onMounted(async () => {
  await Promise.all([fetchHabits(), fetchEntries(), fetchProgress(), fetchPrayerEntries()])
})
</script>

<template>
  <div class="space-y-6">
    <DashboardQuickStats />
    <DashboardIftarCountdown />

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-6">
        <DashboardDailyProgress />
        <DashboardPrayerStreak />
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
