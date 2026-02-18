<script setup lang="ts">
const { t } = useI18n()
const { profile } = useProfile()
const { adjustedTimes, loading, fetchPrayerTimes } = usePrayerTimes()

const prayerList = computed(() => {
  if (!adjustedTimes.value) return []
  return [
    { key: 'imsak', label: t('prayer.imsak'), time: adjustedTimes.value.Imsak, highlight: true },
    { key: 'fajr', label: t('prayer.fajr'), time: adjustedTimes.value.Fajr, highlight: false },
    { key: 'sunrise', label: t('prayer.sunrise'), time: adjustedTimes.value.Sunrise, highlight: false },
    { key: 'dhuhr', label: t('prayer.dhuhr'), time: adjustedTimes.value.Dhuhr, highlight: false },
    { key: 'asr', label: t('prayer.asr'), time: adjustedTimes.value.Asr, highlight: false },
    { key: 'maghrib', label: t('prayer.iftar'), time: adjustedTimes.value.Maghrib, highlight: true },
    { key: 'isha', label: t('prayer.isha'), time: adjustedTimes.value.Isha, highlight: false },
  ]
})

watch(() => profile.value?.city, (city) => {
  if (city && !adjustedTimes.value) fetchPrayerTimes()
}, { immediate: true })
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.prayerTimes') }}</CardTitle>
      <CardDescription v-if="profile?.city">{{ profile.city }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="text-sm text-muted-foreground text-center py-4">
        {{ t('common.loading') }}
      </div>
      <div v-else-if="!adjustedTimes" class="text-sm text-muted-foreground text-center py-4">
        {{ t('onboarding.selectLocation') }}
      </div>
      <div v-else class="space-y-1">
        <div
          v-for="prayer in prayerList"
          :key="prayer.key"
          class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
          :class="prayer.highlight ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-muted/50'"
        >
          <span class="text-sm">{{ prayer.label }}</span>
          <span class="text-sm font-medium tabular-nums">{{ prayer.time }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
