import { success, failure } from '~/types/result'
import type { OperationResult } from '~/types/result'

const PRAYER_NAMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
type PrayerName = typeof PRAYER_NAMES[number]

function entryKey(day: number, prayer: string): string {
  return `${day}-${prayer}`
}

export function usePrayerEntries() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { currentDay } = useRamadanDay()

  const entries = useState<Map<string, boolean>>('prayer-entries', () => new Map())
  const loading = useState<boolean>('prayer-entries-loading', () => false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  const todayCompleted = computed(() => {
    const day = currentDay.value
    if (day <= 0) return 0
    let count = 0
    for (const prayer of PRAYER_NAMES) {
      if (entries.value.get(entryKey(day, prayer))) count++
    }
    return count
  })

  const prayerStreak = computed(() => {
    const today = currentDay.value
    if (today <= 0) return 0
    let streak = 0
    for (let day = today; day >= 1; day--) {
      const allDone = PRAYER_NAMES.every(
        (p) => entries.value.get(entryKey(day, p)) === true
      )
      if (allDone) {
        streak++
      } else {
        break
      }
    }
    return streak
  })

  async function fetchPrayerEntries(): Promise<void> {
    const userId = getUserId()
    if (!userId) return
    loading.value = true

    const { data } = await client
      .from('prayer_entries')
      .select('ramadan_day, prayer_name')
      .eq('user_id', userId)

    const map = new Map<string, boolean>()
    for (const row of (data ?? []) as { ramadan_day: number; prayer_name: string }[]) {
      map.set(entryKey(row.ramadan_day, row.prayer_name), true)
    }
    entries.value = map
    loading.value = false
  }

  async function togglePrayer(day: number, prayer: PrayerName): Promise<OperationResult<boolean>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')

    const key = entryKey(day, prayer)
    const current = entries.value.get(key) ?? false
    const newValue = !current

    // Optimistic update
    const updated = new Map(entries.value)
    updated.set(key, newValue)
    entries.value = updated

    if (newValue) {
      const { error } = await client
        .from('prayer_entries')
        .upsert({
          user_id: userId,
          ramadan_day: day,
          prayer_name: prayer,
        }, {
          onConflict: 'user_id,ramadan_day,prayer_name',
        })

      if (error) {
        const rollback = new Map(entries.value)
        rollback.set(key, current)
        entries.value = rollback
        return failure(error.message)
      }
    } else {
      const { error } = await client
        .from('prayer_entries')
        .delete()
        .eq('user_id', userId)
        .eq('ramadan_day', day)
        .eq('prayer_name', prayer)

      if (error) {
        const rollback = new Map(entries.value)
        rollback.set(key, current)
        entries.value = rollback
        return failure(error.message)
      }
    }

    return success(newValue)
  }

  return {
    entries: readonly(entries),
    loading: readonly(loading),
    todayCompleted,
    prayerStreak,
    fetchPrayerEntries,
    togglePrayer,
  }
}
