import type { TelegramUser } from '~/types/telegram'

export default defineNuxtPlugin(async (nuxtApp) => {
  const tgWebApp = window.Telegram?.WebApp
  if (!tgWebApp?.initData) return

  const tg = useTelegram()

  const { init, backButton, closingBehavior, miniApp } = await import('@telegram-apps/sdk')

  try {
    init()
  } catch {
    return
  }

  const params = new URLSearchParams(tgWebApp.initData)
  const userJson = params.get('user')
  const tgUser = userJson ? JSON.parse(userJson) : null

  tg._setActive(true)
  tg._setInitDataRaw(tgWebApp.initData)

  if (tgUser) {
    tg._setUser({
      id: tgUser.id,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      languageCode: tgUser.language_code,
      isPremium: tgUser.is_premium,
      photoUrl: tgUser.photo_url,
    } satisfies TelegramUser)
  }

  const supabase = useSupabaseClient()
  const { data: { session: existingSession } } = await supabase.auth.getSession()

  if (!existingSession) {
    try {
      const response = await $fetch<{ token_hash: string; email: string }>(
        '/api/auth/telegram-webapp',
        {
          method: 'POST',
          body: { initData: tgWebApp.initData },
        },
      )

      await supabase.auth.verifyOtp({
        token_hash: response.token_hash,
        type: 'magiclink',
      })

      tg._setAuthenticated(true)
    } catch (error) {
      console.error('Telegram webapp auth failed:', error)
    }
  } else {
    tg._setAuthenticated(true)
  }

  tgWebApp.ready()
  tgWebApp.expand()

  try {
    if (backButton.mount.isAvailable()) backButton.mount()
    if (closingBehavior.mount.isAvailable()) {
      closingBehavior.mount()
      closingBehavior.enableConfirmation()
    }
    if (miniApp.mount.isAvailable()) miniApp.mount()
  } catch {
    // Non-critical SDK component mounting
  }

  if (tgUser?.language_code) {
    const supportedLocales = ['uz', 'ru', 'en']
    if (supportedLocales.includes(tgUser.language_code)) {
      const i18n = nuxtApp.$i18n as { locale: { value: string } } | undefined
      if (i18n) {
        i18n.locale.value = tgUser.language_code
      }
      const localeCookie = useCookie('i18n_locale')
      localeCookie.value = tgUser.language_code
    }
  }
})
