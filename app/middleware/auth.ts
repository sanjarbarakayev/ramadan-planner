export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { isActive: isTelegram } = useTelegram()

  if (isTelegram.value) return

  if (!user.value?.id && !session.value && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login')
  }
})
