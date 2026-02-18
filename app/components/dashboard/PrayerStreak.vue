<script setup lang="ts">
const { t } = useI18n()
const { showError } = useAppToast()
const { currentDay } = useRamadanDay()
const { entries, todayCompleted, prayerStreak, togglePrayer } = usePrayerEntries()

const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const

function isChecked(prayer: string): boolean {
  const day = currentDay.value
  if (day <= 0) return false
  return entries.value.get(`${day}-${prayer}`) ?? false
}

async function handleToggle(prayer: typeof prayers[number]) {
  const day = currentDay.value
  if (day <= 0) return
  const result = await togglePrayer(day, prayer)
  if (!result.ok) {
    showError('toast.prayerEntryError')
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-base">{{ t('dashboard.prayerStreak.title') }}</CardTitle>
        <span v-if="prayerStreak > 0" class="text-sm font-medium text-primary">
          {{ prayerStreak }} {{ t('dashboard.days') }}
        </span>
      </div>
      <CardDescription>
        {{ t('dashboard.prayerStreak.todayCount', { count: todayCompleted }) }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <label
          v-for="prayer in prayers"
          :key="prayer"
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50 cursor-pointer"
        >
          <Checkbox
            :checked="isChecked(prayer)"
            @update:checked="handleToggle(prayer)"
          />
          <span class="text-sm">{{ t(`prayer.${prayer}`) }}</span>
        </label>
      </div>
    </CardContent>
  </Card>
</template>
