<script setup lang="ts">
interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

const emit = defineEmits<{
  success: []
  error: [message: string]
}>()

const config = useRuntimeConfig()
const client = useSupabaseClient()
const router = useRouter()
const loading = ref(false)

const botUsername = config.public.telegramBotUsername as string
const botId = config.public.telegramBotId as string

async function handleTelegramAuth(user: TelegramUser) {
  loading.value = true

  try {
    const { token_hash } = await $fetch<{ token_hash: string }>('/api/auth/telegram', {
      method: 'POST',
      body: user,
    })

    const { error } = await client.auth.verifyOtp({
      token_hash,
      type: 'magiclink',
    })

    if (error) {
      emit('error', error.message)
      return
    }

    emit('success')
    await router.push('/dashboard')
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Telegram auth failed'
    emit('error', message)
  }
  finally {
    loading.value = false
  }
}

function openTelegramAuth() {
  if (!botId) {
    emit('error', 'Telegram bot not configured')
    return
  }

  const origin = window.location.origin
  const callbackName = `__tgAuthCallback_${Date.now()}`

  ;(window as Record<string, unknown>)[callbackName] = (user: TelegramUser) => {
    delete (window as Record<string, unknown>)[callbackName]
    handleTelegramAuth(user)
  }

  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}&embed=0&request_access=write&return_to=${encodeURIComponent(origin)}`

  const popup = window.open(
    authUrl,
    'telegram_auth',
    'width=550,height=470,toolbar=no,menubar=no,scrollbars=no',
  )

  if (!popup) {
    emit('error', 'Popup blocked. Please allow popups for this site.')
    delete (window as Record<string, unknown>)[callbackName]
    return
  }

  // Listen for auth result via postMessage
  function onMessage(event: MessageEvent) {
    if (event.origin !== 'https://oauth.telegram.org') return

    window.removeEventListener('message', onMessage)

    if (event.data && typeof event.data === 'object' && 'id' in event.data) {
      handleTelegramAuth(event.data as TelegramUser)
    }
  }

  window.addEventListener('message', onMessage)
}
</script>

<template>
  <Button
    variant="outline"
    class="w-full"
    :disabled="loading || !botId"
    @click="openTelegramAuth"
  >
    <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
    {{ loading ? $t('common.loading') : $t('auth.loginWithTelegram') }}
  </Button>
</template>
