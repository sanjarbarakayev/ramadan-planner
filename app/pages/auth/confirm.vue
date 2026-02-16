<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const client = useSupabaseClient()
const session = useSupabaseSession()

watch(session, (s) => {
  if (s) {
    window.location.replace('/dashboard')
  }
}, { immediate: true })

onMounted(() => {
  const { data: { subscription } } = client.auth.onAuthStateChange((event, s) => {
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && s) {
      subscription.unsubscribe()
      window.location.replace('/dashboard')
    }
  })
})
</script>

<template>
  <Card>
    <CardContent class="flex items-center justify-center p-8">
      <p class="text-muted-foreground">
        {{ $t('common.loading') }}
      </p>
    </CardContent>
  </Card>
</template>
