<script setup lang="ts">
const { t } = useI18n()
const { todayCompleted, todayTotal, overallPercentage, streak } = useStats()
const { loading } = useHabits()
</script>

<template>
  <div class="grid grid-cols-3 gap-2 sm:gap-4">
    <template v-if="loading">
      <Card v-for="i in 3" :key="i">
        <CardContent class="p-2.5 sm:p-4 text-center space-y-2">
          <Skeleton class="mx-auto hidden sm:block h-10 w-10 rounded-full" />
          <Skeleton class="mx-auto h-6 w-16" />
          <Skeleton class="mx-auto h-3 w-20" />
        </CardContent>
      </Card>
    </template>
    <template v-else>
      <Card>
        <CardContent class="p-2.5 sm:p-4 text-center">
          <div class="mx-auto mb-2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-lg sm:text-2xl font-bold">{{ todayCompleted }}/{{ todayTotal }}</p>
          <p class="text-xs text-muted-foreground">{{ t('dashboard.completed') }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-2.5 sm:p-4 text-center">
          <div class="mx-auto mb-2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <svg class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p class="text-lg sm:text-2xl font-bold">{{ overallPercentage }}%</p>
          <p class="text-xs text-muted-foreground">{{ t('dashboard.overall') }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-2.5 sm:p-4 text-center">
          <div class="mx-auto mb-2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <svg class="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <p class="text-lg sm:text-2xl font-bold">{{ streak }}</p>
          <p class="text-xs text-muted-foreground">{{ t('dashboard.streak') }}</p>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
