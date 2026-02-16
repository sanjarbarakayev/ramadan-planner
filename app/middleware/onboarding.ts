export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const client = useSupabaseClient()

  const userId = user.value?.id || session.value?.user?.id
  if (!userId) return
  if (to.path === '/onboarding') return

  const { data: profile } = await client
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', userId)
    .single()

  if (profile && !profile.onboarding_complete) {
    return navigateTo('/onboarding')
  }
})
