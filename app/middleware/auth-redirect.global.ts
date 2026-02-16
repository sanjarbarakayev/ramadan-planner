export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const session = useSupabaseSession()

  if ((user.value?.id || session.value) && to.path.startsWith('/auth')) {
    return navigateTo('/dashboard')
  }
})
