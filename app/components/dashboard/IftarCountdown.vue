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
  <Card class="bg-gradient-to-br from-[oklch(0.30_0.04_175)] to-[oklch(0.24_0.035_180)] border-0 shadow-lg">
    <CardContent class="flex flex-col items-center justify-center py-8">
      <template v-if="countdown">
        <p class="text-sm font-medium text-[#dbb84a]/80 mb-2">{{ countdown.label }}</p>
        <p class="text-5xl font-bold tabular-nums tracking-wider text-[#f2e4a8]">{{ countdown.time }}</p>
      </template>
      <div v-else class="flex flex-col items-center gap-2">
        <p class="text-sm text-[#dbb84a]/70">
          {{ t('dashboard.countdown.noData') }}
        </p>
        <Button
          variant="outline"
          size="sm"
          class="border-[#dbb84a]/30 text-[#dbb84a] hover:bg-[#dbb84a]/10 hover:text-[#f2e4a8]"
          @click="navigateTo('/settings')"
        >
          {{ t('onboarding.selectLocation') }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
