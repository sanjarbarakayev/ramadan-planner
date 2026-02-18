export interface PrayerTimesData {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
  Imsak: string
}

export function usePrayerTimes() {
  const { profile } = useProfile()
  const { showError } = useAppToast()

  const times = useState<PrayerTimesData | null>('prayer-times', () => null)
  const loading = useState<boolean>('prayer-times-loading', () => false)

  function adjustTime(time: string): string {
    if (!time || !profile.value?.time_adjustment) return time
    const parts = time.split(':')
    if (parts.length !== 2) return time
    const hours = Number(parts[0])
    const minutes = Number(parts[1])
    if (isNaN(hours) || isNaN(minutes)) return time
    const totalMinutes = hours * 60 + minutes + profile.value.time_adjustment
    const h = ((Math.floor(totalMinutes / 60) % 24) + 24) % 24
    const m = ((totalMinutes % 60) + 60) % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const adjustedTimes = computed(() => {
    if (!times.value) return null
    return {
      Fajr: adjustTime(times.value.Fajr),
      Sunrise: adjustTime(times.value.Sunrise),
      Dhuhr: adjustTime(times.value.Dhuhr),
      Asr: adjustTime(times.value.Asr),
      Maghrib: adjustTime(times.value.Maghrib),
      Isha: adjustTime(times.value.Isha),
      Imsak: adjustTime(times.value.Imsak),
    }
  })

  async function fetchPrayerTimes(): Promise<void> {
    if (!profile.value?.city) return
    loading.value = true

    try {
      const { data } = await useFetch('/api/prayer-times', {
        params: {
          city: profile.value.city,
          country: profile.value.country ?? '',
          method: profile.value.prayer_method ?? 3,
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

  return {
    times: readonly(times),
    loading: readonly(loading),
    adjustedTimes,
    fetchPrayerTimes,
  }
}
