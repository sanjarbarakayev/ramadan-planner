export interface TelegramUser {
  readonly id: number
  readonly firstName: string
  readonly lastName?: string
  readonly username?: string
  readonly languageCode?: string
  readonly isPremium?: boolean
  readonly photoUrl?: string
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        readonly initData: string
        ready(): void
        expand(): void
        close(): void
      }
    }
  }
}

export {}
