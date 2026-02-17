<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const error = ref('')

onMounted(() => {
  const hash = window.location.hash
  if (!hash.includes('tgAuthResult=')) {
    error.value = 'No auth data received from Telegram'
    return
  }

  const encoded = hash.split('tgAuthResult=')[1]
  if (!encoded) {
    error.value = 'Empty auth result'
    return
  }

  try {
    const decoded = JSON.parse(atob(encoded))

    if (window.opener) {
      window.opener.postMessage(decoded, window.location.origin)
      window.close()
    }
    else {
      // Fallback: if popup was blocked and user was redirected directly
      error.value = 'Please close this window and try again'
    }
  }
  catch {
    error.value = 'Failed to process Telegram auth data'
  }
})
</script>

<template>
  <Card>
    <CardContent class="flex items-center justify-center p-8">
      <p v-if="error" class="text-sm text-destructive">
        {{ error }}
      </p>
      <p v-else class="text-muted-foreground">
        {{ $t('common.loading') }}
      </p>
    </CardContent>
  </Card>
</template>
