import { success, failure } from '~/types/result'
import type { OperationResult } from '~/types/result'

export interface JournalEntry {
  id: string
  user_id: string
  ramadan_day: number
  content: string
  created_at: string
}

export function useJournal() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { currentDay } = useRamadanDay()

  const journalEntries = useState<JournalEntry[]>('journal-entries', () => [])
  const loading = useState<boolean>('journal-loading', () => false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  const sortedEntries = computed(() =>
    [...journalEntries.value].sort((a, b) => b.ramadan_day - a.ramadan_day)
  )

  const todayEntry = computed(() =>
    journalEntries.value.find((e) => e.ramadan_day === currentDay.value) ?? null
  )

  const entryCount = computed(() => journalEntries.value.length)

  async function fetchEntries(): Promise<void> {
    const userId = getUserId()
    if (!userId) return
    loading.value = true

    const { data } = await client
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('ramadan_day', { ascending: false })

    journalEntries.value = (data ?? []) as JournalEntry[]
    loading.value = false
  }

  async function saveEntry(content: string): Promise<OperationResult<JournalEntry>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')

    const day = currentDay.value
    if (day <= 0) return failure('Not during Ramadan')

    const { data, error } = await client
      .from('journal_entries')
      .upsert({
        user_id: userId,
        ramadan_day: day,
        content,
      }, {
        onConflict: 'user_id,ramadan_day',
      })
      .select()
      .single()

    if (error) return failure(error.message)

    const entry = data as JournalEntry
    const existing = journalEntries.value.findIndex((e) => e.ramadan_day === day)
    if (existing >= 0) {
      journalEntries.value = journalEntries.value.map((e, i) =>
        i === existing ? entry : e
      )
    } else {
      journalEntries.value = [...journalEntries.value, entry]
    }

    return success(entry)
  }

  async function deleteEntry(id: string): Promise<OperationResult<void>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')

    const { error } = await client
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) return failure(error.message)

    journalEntries.value = journalEntries.value.filter((e) => e.id !== id)
    return success(undefined)
  }

  return {
    journalEntries: readonly(journalEntries),
    loading: readonly(loading),
    sortedEntries,
    todayEntry,
    entryCount,
    fetchEntries,
    saveEntry,
    deleteEntry,
  }
}
