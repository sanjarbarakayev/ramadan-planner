<script setup lang="ts">
const { t } = useI18n()
const { isBefore, isDuring, daysUntil, currentDay } = useRamadanDay()
const { todayPercentage } = useStats()

const message = computed(() => {
  if (isBefore.value) {
    return t('dashboard.motivational.before')
  }
  const pct = todayPercentage.value
  if (pct >= 80) return t('dashboard.motivational.excellent')
  if (pct >= 50) return t('dashboard.motivational.good')
  if (pct >= 25) return t('dashboard.motivational.average')
  return t('dashboard.motivational.needsWork')
})
</script>

<template>
  <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-md">
    <div class="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
    <div class="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
    <div class="relative">
      <h2 v-if="isDuring" class="text-xl font-bold">
        {{ t('dashboard.ramadanDay', { day: currentDay }) }}
      </h2>
      <h2 v-else-if="isBefore" class="text-xl font-bold">
        {{ t('dashboard.daysUntilRamadan', { days: daysUntil }) }}
      </h2>
      <h2 v-else class="text-xl font-bold">
        {{ t('dashboard.ramadanStarted') }}
      </h2>
      <p class="mt-1.5 text-primary-foreground/80">
        {{ message }}
      </p>
    </div>
  </div>
</template>
