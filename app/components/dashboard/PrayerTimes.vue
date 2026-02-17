<script setup lang="ts">
const { t } = useI18n()
const { profile } = useProfile()

interface PrayerTimesData {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
  Imsak: string
}

const times = ref<PrayerTimesData | null>(null)
const loading = ref(false)
const { showError } = useAppToast()

async function fetchPrayerTimes() {
  if (!profile.value?.city) return
  loading.value = true

  try {
    const { data } = await useFetch('/api/prayer-times', {
      params: {
        city: profile.value.city,
        country: profile.value.country ?? '',
        method: profile.value.prayer_method ?? 14,
      },
    })

    if (data.value) {
      times.value = data.value as PrayerTimesData
    }
  } catch {
    showError('toast.prayerTimesError')
  } finally {
    loading.value = false
  }
}

function adjustTime(time: string): string {
  if (!time || !profile.value?.time_adjustment) return time
  const parts = time.split(':')
  if (parts.length !== 2) return time
  const hours = Number(parts[0])
  const minutes = Number(parts[1])
  if (isNaN(hours) || isNaN(minutes)) return time
  const totalMinutes = hours * 60 + minutes + profile.value.time_adjustment
  // Use ((n % m) + m) % m to handle negative modulo correctly
  const h = ((Math.floor(totalMinutes / 60) % 24) + 24) % 24
  const m = ((totalMinutes % 60) + 60) % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const prayerList = computed(() => {
  if (!times.value) return []
  return [
    { key: 'imsak', label: t('prayer.imsak'), time: adjustTime(times.value.Imsak), highlight: true },
    { key: 'fajr', label: t('prayer.fajr'), time: adjustTime(times.value.Fajr), highlight: false },
    { key: 'sunrise', label: t('prayer.sunrise'), time: adjustTime(times.value.Sunrise), highlight: false },
    { key: 'dhuhr', label: t('prayer.dhuhr'), time: adjustTime(times.value.Dhuhr), highlight: false },
    { key: 'asr', label: t('prayer.asr'), time: adjustTime(times.value.Asr), highlight: false },
    { key: 'maghrib', label: t('prayer.iftar'), time: adjustTime(times.value.Maghrib), highlight: true },
    { key: 'isha', label: t('prayer.isha'), time: adjustTime(times.value.Isha), highlight: false },
  ]
})

watch(() => profile.value?.city, (city) => {
  if (city && !times.value) fetchPrayerTimes()
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
      <div v-else-if="!times" class="text-sm text-muted-foreground text-center py-4">
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
