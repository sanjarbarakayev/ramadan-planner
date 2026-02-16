export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  if (!user.value?.id) return
  if (to.path === '/onboarding') return

  const { data: profile } = await client
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.value.id)
    .single()

  if (profile && !profile.onboarding_complete) {
    return navigateTo('/onboarding')
  }
})
