<script setup lang="ts">
const { t } = useI18n()
const { showError } = useAppToast()
const { completedJuzs, completedCount, percentage, toggleJuz } = useQuranProgress()

async function handleToggle(juz: number) {
  const result = await toggleJuz(juz)
  if (!result.ok) {
    showError('toast.quranError')
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.quranTracker') }}</CardTitle>
      <CardDescription>{{ t('dashboard.quranProgress', { completed: completedCount, total: 30 }) }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <Progress :model-value="percentage" class="h-2" />

      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="juz in 30"
          :key="juz"
          class="flex h-9 w-full items-center justify-center rounded-md text-sm font-medium transition-colors"
          :class="completedJuzs.get(juz)
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'"
          @click="handleToggle(juz)"
        >
          {{ juz }}
        </button>
      </div>
    </CardContent>
  </Card>
</template>
