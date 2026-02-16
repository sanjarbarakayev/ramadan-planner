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

  async function fetchProfile() {
    const userId = getUserId()
    if (!userId) return null
    loading.value = true

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
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
    const userId = getUserId()
    if (!userId) return null

    // Auto-sync theme when gender changes
    if (updates.gender) {
      updates.theme = genderToTheme(updates.gender)
    }

    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', userId)
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
    themeClass,
    fetchProfile,
    updateProfile,
    completeOnboarding,
  }
}
