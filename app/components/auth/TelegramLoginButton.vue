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
const widgetContainer = ref<HTMLElement>()

const botUsername = config.public.telegramBotUsername as string

const CALLBACK_NAME = '__onTelegramWidgetAuth'

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

onMounted(() => {
  if (!botUsername) return

  ;(window as Record<string, unknown>)[CALLBACK_NAME] = (user: TelegramUser) => {
    handleTelegramAuth(user)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', botUsername)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-radius', '8')
  script.setAttribute('data-onauth', `${CALLBACK_NAME}(user)`)
  script.setAttribute('data-request-access', 'write')

  widgetContainer.value?.appendChild(script)
})

onUnmounted(() => {
  delete (window as Record<string, unknown>)[CALLBACK_NAME]
})
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <div v-if="loading" class="text-sm text-muted-foreground">
      {{ $t('common.loading') }}
    </div>
    <div v-else ref="widgetContainer" />
    <div v-if="!botUsername" class="text-sm text-destructive">
      Telegram bot not configured
    </div>
  </div>
</template>
