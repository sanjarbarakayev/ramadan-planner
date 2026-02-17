import type { TelegramUser } from '~/types/telegram'

export function useTelegram() {
  const isActive = useState<boolean>('tg:active', () => false)
  const user = useState<TelegramUser | null>('tg:user', () => null)
  const initDataRaw = useState<string>('tg:initDataRaw', () => '')
  const authenticated = useState<boolean>('tg:authenticated', () => false)

  return {
    isActive: readonly(isActive),
    user: readonly(user),
    initDataRaw: readonly(initDataRaw),
    authenticated: readonly(authenticated),
    _setActive(value: boolean) { isActive.value = value },
    _setUser(value: TelegramUser | null) { user.value = value },
    _setInitDataRaw(value: string) { initDataRaw.value = value },
    _setAuthenticated(value: boolean) { authenticated.value = value },
  }
}
