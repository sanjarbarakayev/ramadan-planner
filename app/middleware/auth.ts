export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  console.log('[auth] to:', to.path, 'user:', user.value?.id ?? 'null')

  if (!user.value?.id && !to.path.startsWith('/auth')) {
    console.log('[auth] no user, redirecting to /auth/login')
    return navigateTo('/auth/login')
  }
})
