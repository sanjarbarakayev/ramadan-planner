export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  console.log('[auth-redirect.global] to:', to.path, 'user:', user.value?.id ?? 'null')

  if (user.value?.id && to.path.startsWith('/auth')) {
    console.log('[auth-redirect.global] redirecting authenticated user to /dashboard')
    return navigateTo('/dashboard')
  }
})
