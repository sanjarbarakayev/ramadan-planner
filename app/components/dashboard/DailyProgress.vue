<script setup lang="ts">
const { t } = useI18n()
const { todayCompleted, todayTotal, todayPercentage } = useStats()

const circumference = 2 * Math.PI * 45
const dashOffset = computed(() => {
  return circumference - (todayPercentage.value / 100) * circumference
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.todayProgress') }}</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col items-center">
      <div class="relative h-36 w-36">
        <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            stroke-width="10"
            class="text-primary/10"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            stroke-width="10"
            stroke-linecap="round"
            class="text-primary transition-all duration-700 ease-out"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-bold">{{ todayPercentage }}%</span>
        </div>
      </div>
      <p class="mt-3 text-sm text-muted-foreground">
        {{ todayCompleted }}/{{ todayTotal }} {{ t('dashboard.completed') }}
      </p>
    </CardContent>
  </Card>
</template>
