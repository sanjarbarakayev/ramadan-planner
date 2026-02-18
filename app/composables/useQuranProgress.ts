import { success, failure } from '~/types/result'
import type { OperationResult } from '~/types/result'

export function useQuranProgress() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()

  const completedJuzs = useState<Map<number, boolean>>('quran-progress', () => new Map())
  const loading = useState<boolean>('quran-progress-loading', () => false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  const completedCount = computed(() => {
    let count = 0
    for (const completed of completedJuzs.value.values()) {
      if (completed) count++
    }
    return count
  })

  const percentage = computed(() =>
    Math.round((completedCount.value / 30) * 100)
  )

  async function fetchProgress(): Promise<void> {
    const userId = getUserId()
    if (!userId) return
    loading.value = true

    const { data } = await client
      .from('quran_progress')
      .select('juz_number')
      .eq('user_id', userId)

    const map = new Map<number, boolean>()
    for (const row of (data ?? []) as { juz_number: number }[]) {
      map.set(row.juz_number, true)
    }
    completedJuzs.value = map
    loading.value = false
  }

  async function toggleJuz(juzNumber: number): Promise<OperationResult<boolean>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')

    const current = completedJuzs.value.get(juzNumber) ?? false
    const newValue = !current

    // Optimistic update
    const updated = new Map(completedJuzs.value)
    updated.set(juzNumber, newValue)
    completedJuzs.value = updated

    if (newValue) {
      const { error } = await client
        .from('quran_progress')
        .upsert({
          user_id: userId,
          juz_number: juzNumber,
        }, {
          onConflict: 'user_id,juz_number',
        })

      if (error) {
        const rollback = new Map(completedJuzs.value)
        rollback.set(juzNumber, current)
        completedJuzs.value = rollback
        return failure(error.message)
      }
    } else {
      const { error } = await client
        .from('quran_progress')
        .delete()
        .eq('user_id', userId)
        .eq('juz_number', juzNumber)

      if (error) {
        const rollback = new Map(completedJuzs.value)
        rollback.set(juzNumber, current)
        completedJuzs.value = rollback
        return failure(error.message)
      }
    }

    return success(newValue)
  }

  return {
    completedJuzs: readonly(completedJuzs),
    loading: readonly(loading),
    completedCount,
    percentage,
    fetchProgress,
    toggleJuz,
  }
}
