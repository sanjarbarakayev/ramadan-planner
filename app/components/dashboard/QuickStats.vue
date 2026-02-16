<script setup lang="ts">
const { t } = useI18n()
const { todayCompleted, todayTotal, overallPercentage, streak } = useStats()
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <Card>
      <CardContent class="p-4 text-center">
        <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold">{{ todayCompleted }}/{{ todayTotal }}</p>
        <p class="text-xs text-muted-foreground">{{ t('dashboard.completed') }}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="p-4 text-center">
        <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p class="text-2xl font-bold">{{ overallPercentage }}%</p>
        <p class="text-xs text-muted-foreground">{{ t('dashboard.overall') }}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="p-4 text-center">
        <div class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        </div>
        <p class="text-2xl font-bold">{{ streak }}</p>
        <p class="text-xs text-muted-foreground">{{ t('dashboard.streak') }}</p>
      </CardContent>
    </Card>
  </div>
</template>
