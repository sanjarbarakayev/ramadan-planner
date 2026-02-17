<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  success: []
  error: [message: string]
}>()

const client = useSupabaseClient()
const router = useRouter()

const loading = ref(false)
const polling = ref(false)
const deeplink = ref('')
const activeToken = ref('')

let pollTimer: ReturnType<typeof setInterval> | undefined

async function startDeeplinkLogin() {
  loading.value = true

  try {
    const response = await $fetch<{ token: string; deeplink: string }>('/api/auth/telegram-deeplink', {
      method: 'POST',
    })

    activeToken.value = response.token
    deeplink.value = response.deeplink

    // Open Telegram deep link
    window.open(response.deeplink, '_blank')

    // Start polling for confirmation
    polling.value = true
    pollForConfirmation()
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to start Telegram login'
    emit('error', message)
  }
  finally {
    loading.value = false
  }
}

function pollForConfirmation() {
  clearInterval(pollTimer)

  let attempts = 0
  const maxAttempts = 60 // 2 minutes at 2s intervals

  pollTimer = setInterval(async () => {
    attempts++

    if (attempts > maxAttempts) {
      stopPolling()
      emit('error', 'Login timed out. Please try again.')
      return
    }

    try {
      const response = await $fetch<{ status: string; token_hash?: string }>('/api/auth/telegram-deeplink-status', {
        params: { token: activeToken.value },
      })

      if (response.status === 'confirmed' && response.token_hash) {
        stopPolling()
        await completeLogin(response.token_hash)
      }
    }
    catch {
      // Token expired or error - stop polling
      stopPolling()
    }
  }, 2000)
}

function stopPolling() {
  clearInterval(pollTimer)
  pollTimer = undefined
  polling.value = false
  deeplink.value = ''
  activeToken.value = ''
}

async function completeLogin(tokenHash: string) {
  loading.value = true

  try {
    const { error } = await client.auth.verifyOtp({
      token_hash: tokenHash,
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

onUnmounted(() => {
  clearInterval(pollTimer)
})
</script>

<template>
  <div class="w-full space-y-2">
    <Button
      variant="outline"
      class="w-full"
      :disabled="loading || polling"
      @click="startDeeplinkLogin"
    >
      <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
      <template v-if="loading">
        {{ t('common.loading') }}
      </template>
      <template v-else-if="polling">
        {{ t('auth.waitingForTelegram', 'Waiting for confirmation...') }}
      </template>
      <template v-else>
        {{ t('auth.loginWithTelegram') }}
      </template>
    </Button>

    <div v-if="polling" class="rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
      <p>{{ t('auth.openTelegramAndConfirm', 'Open Telegram and click Start in the bot chat') }}</p>
      <a
        :href="deeplink"
        target="_blank"
        class="mt-1 inline-block font-medium text-primary hover:underline"
      >
        {{ t('auth.openTelegramAgain', 'Open Telegram again') }}
      </a>
    </div>
  </div>
</template>
