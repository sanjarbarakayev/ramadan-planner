<script setup lang="ts">
const user = useSupabaseUser()
const session = useSupabaseSession()

watchEffect(() => {
  if (user.value?.id || session.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/auth/login')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="text-muted-foreground">{{ $t('common.loading') }}</p>
  </div>
</template>
