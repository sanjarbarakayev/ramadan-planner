<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const client = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  const { error: authError } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    loading.value = false
    return
  }

  await router.push('/dashboard')
}

async function handleGoogleLogin() {
  loading.value = true
  console.log('[login] handleGoogleLogin, redirectTo:', `${window.location.origin}/auth/confirm`)
  const { error: authError } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/confirm`,
    },
  })

  if (authError) {
    error.value = authError.message
    loading.value = false
  }
}

function handleTelegramError(message: string) {
  error.value = message
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-center">
        {{ t('auth.login') }}
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        {{ error }}
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-2">
          <Label for="email">{{ t('auth.email') }}</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            required
            :placeholder="t('auth.email')"
          />
        </div>

        <div class="space-y-2">
          <Label for="password">{{ t('auth.password') }}</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            required
            :placeholder="t('auth.password')"
          />
        </div>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? t('common.loading') : t('auth.login') }}
        </Button>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-card px-2 text-muted-foreground">{{ t('auth.or') }}</span>
        </div>
      </div>

      <div class="space-y-3">
        <Button variant="outline" class="w-full" :disabled="loading" @click="handleGoogleLogin">
          <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {{ t('auth.loginWithGoogle') }}
        </Button>

        <AuthTelegramLoginButton @error="handleTelegramError" />
      </div>

      <p class="text-center text-sm text-muted-foreground">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/auth/register" class="font-medium text-primary hover:underline">
          {{ t('auth.register') }}
        </NuxtLink>
      </p>
    </CardContent>
  </Card>
</template>
