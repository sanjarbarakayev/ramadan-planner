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

export function useProfile() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = useState<Profile | null>('profile', () => null)
  const loading = ref(false)

  async function fetchProfile() {
    if (!user.value?.id) return null
    loading.value = true

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      loading.value = false
      return null
    }

    profile.value = data as Profile
    loading.value = false
    return profile.value
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user.value?.id) return null

    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    profile.value = data as Profile
    return profile.value
  }

  async function completeOnboarding(profileData: Partial<Profile>) {
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
