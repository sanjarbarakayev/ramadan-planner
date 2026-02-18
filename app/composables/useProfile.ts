import { success, failure } from '~/types/result'
import type { OperationResult } from '~/types/result'

export interface Profile {
  id: string
  language: string
  theme: string
  city: string | null
  country: string | null
  lat: number | null
  lng: number | null
  ramadan_start_date: string
  prayer_method: number
  time_adjustment: number
  onboarding_complete: boolean
}

export function useProfile() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const profile = useState<Profile | null>('profile', () => null)
  const loading = ref(false)

  function getUserId(): string | undefined {
    return user.value?.id || session.value?.user?.id
  }

  async function fetchProfile(): Promise<OperationResult<Profile>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')
    loading.value = true

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    loading.value = false

    if (error) {
      return failure(error.message)
    }

    profile.value = data as Profile
    return success(profile.value)
  }

  async function updateProfile(updates: Partial<Profile>): Promise<OperationResult<Profile>> {
    const userId = getUserId()
    if (!userId) return failure('Not authenticated')

    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return failure(error.message)
    }

    profile.value = data as Profile
    return success(profile.value)
  }

  async function completeOnboarding(profileData: Partial<Profile>): Promise<OperationResult<Profile>> {
    return updateProfile({
      ...profileData,
      onboarding_complete: true,
    })
  }

  return {
    profile: readonly(profile),
    loading: readonly(loading),
    fetchProfile,
    updateProfile,
    completeOnboarding,
  }
}
