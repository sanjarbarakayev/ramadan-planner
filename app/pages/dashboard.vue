<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { fetchHabits, fetchEntries } = useHabits()

onMounted(async () => {
  await Promise.all([fetchHabits(), fetchEntries()])
})
</script>

<template>
  <div class="space-y-6">
    <DashboardQuickStats />

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-6">
        <DashboardDailyProgress />
        <DashboardPrayerTimes />
        <DashboardSahurIftarDuas />
        <DashboardDailyTasks />
      </div>
      <div class="space-y-6">
        <DashboardDailyZikr />
      </div>
    </div>
  </div>
</template>
