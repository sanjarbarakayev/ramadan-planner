import { success, failure } from '~/types/result'
import type { OperationResult } from '~/types/result'

export interface Profile {
  id: string
  gender: 'male' | 'female' | null
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

export function genderToTheme(gender: 'male' | 'female' | null): 'men' | 'women' {
  return gender === 'male' ? 'men' : 'women'
}

export function useProfile() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const profile = useState<Profile | null>('profile', () => null)
  const loading = ref(false)

  const themeClass = computed(() => {
    if (!profile.value) return null
    return `theme-${genderToTheme(profile.value.gender)}`
  })

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

    // Auto-sync theme when gender changes (immutable)
    const finalUpdates = updates.gender
      ? { ...updates, theme: genderToTheme(updates.gender) }
      : updates

    const { data, error } = await client
      .from('profiles')
      .update(finalUpdates)
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
    themeClass,
    fetchProfile,
    updateProfile,
    completeOnboarding,
  }
}
