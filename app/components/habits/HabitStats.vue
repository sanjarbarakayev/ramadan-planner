<script setup lang="ts">
const { t } = useI18n()
const { habitStats, overallCompleted, overallTarget, overallPercentage } = useStats()
const { loading } = useHabits()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('habits.stats') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-4 w-10" />
          <Skeleton class="h-4 w-10" />
          <Skeleton class="h-2 flex-1" />
        </div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="px-3 py-2 text-left font-medium">{{ t('habits.habitName') }}</th>
              <th class="px-3 py-2 text-center font-medium">{{ t('habits.target') }}</th>
              <th class="px-3 py-2 text-center font-medium">{{ t('habits.done') }}</th>
              <th class="hidden sm:table-cell px-3 py-2 text-center font-medium">{{ t('habits.remaining') }}</th>
              <th class="px-3 py-2 text-center font-medium">{{ t('habits.progress') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in habitStats" :key="stat.habitId" class="border-b">
              <td class="px-3 py-2">{{ stat.name }}</td>
              <td class="px-3 py-2 text-center">{{ stat.target }}</td>
              <td class="px-3 py-2 text-center">{{ stat.completed }}</td>
              <td class="hidden sm:table-cell px-3 py-2 text-center">{{ stat.remaining }}</td>
              <td class="px-3 py-2">
                <div class="flex items-center gap-2">
                  <Progress :model-value="stat.percentage" class="hidden sm:flex h-2 flex-1" />
                  <span class="text-xs tabular-nums w-10 text-right">{{ stat.percentage }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 font-semibold">
              <td class="px-3 py-2">{{ t('habits.total') }}</td>
              <td class="px-3 py-2 text-center">{{ overallTarget }}</td>
              <td class="px-3 py-2 text-center">{{ overallCompleted }}</td>
              <td class="hidden sm:table-cell px-3 py-2 text-center">{{ overallTarget - overallCompleted }}</td>
              <td class="px-3 py-2">
                <div class="flex items-center gap-2">
                  <Progress :model-value="overallPercentage" class="hidden sm:flex h-2 flex-1" />
                  <span class="text-xs tabular-nums w-10 text-right">{{ overallPercentage }}%</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
