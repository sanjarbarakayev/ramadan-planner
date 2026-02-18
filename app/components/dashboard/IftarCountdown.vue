<script setup lang="ts">
const { t } = useI18n()
const { adjustedTimes, fetchPrayerTimes } = usePrayerTimes()
const now = useNow({ interval: 1000 })

function timeToMinutes(time: string): number {
  const parts = time.split(':')
  if (parts.length !== 2) return 0
  return Number(parts[0]) * 60 + Number(parts[1])
}

function formatCountdown(diffMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const countdown = computed(() => {
  if (!adjustedTimes.value) return null

  const currentDate = now.value
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
  const currentSeconds = currentDate.getSeconds()
  const currentTotalMs = (currentMinutes * 60 + currentSeconds) * 1000

  const imsakMinutes = timeToMinutes(adjustedTimes.value.Imsak)
  const maghribMinutes = timeToMinutes(adjustedTimes.value.Maghrib)

  const imsakMs = imsakMinutes * 60 * 1000
  const maghribMs = maghribMinutes * 60 * 1000

  if (currentMinutes < imsakMinutes) {
    return {
      label: t('dashboard.countdown.toSahur'),
      time: formatCountdown(imsakMs - currentTotalMs),
    }
  }

  if (currentMinutes < maghribMinutes) {
    return {
      label: t('dashboard.countdown.toIftar'),
      time: formatCountdown(maghribMs - currentTotalMs),
    }
  }

  // After Maghrib: count to next day's Imsak
  const msUntilMidnight = (24 * 60 * 60 * 1000) - currentTotalMs
  const nextImsakMs = msUntilMidnight + imsakMs
  return {
    label: t('dashboard.countdown.toSahur'),
    time: formatCountdown(nextImsakMs),
  }
})

onMounted(() => {
  if (!adjustedTimes.value) fetchPrayerTimes()
})
</script>

<template>
  <Card>
    <CardContent class="flex flex-col items-center justify-center py-6">
      <template v-if="countdown">
        <p class="text-sm text-muted-foreground mb-2">{{ countdown.label }}</p>
        <p class="text-4xl font-bold tabular-nums tracking-wider">{{ countdown.time }}</p>
      </template>
      <p v-else class="text-sm text-muted-foreground">
        {{ t('dashboard.countdown.noData') }}
      </p>
    </CardContent>
  </Card>
</template>
