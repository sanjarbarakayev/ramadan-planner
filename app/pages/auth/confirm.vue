<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const client = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

console.log('[confirm] page loaded, path:', route.fullPath)
console.log('[confirm] user.value:', user.value?.id ?? 'null')
console.log('[confirm] query params:', JSON.stringify(route.query))
console.log('[confirm] hash:', route.hash)

onMounted(async () => {
  console.log('[confirm] onMounted, user.value:', user.value?.id ?? 'null')

  if (user.value?.id) {
    console.log('[confirm] user already exists, redirecting')
    window.location.replace('/dashboard')
    return
  }

  // Force session refresh after PKCE code exchange
  console.log('[confirm] calling getSession()...')
  const { data: { session }, error } = await client.auth.getSession()
  console.log('[confirm] getSession result:', session ? `user=${session.user?.id}` : 'no session', error ? `error=${error.message}` : '')

  if (session) {
    console.log('[confirm] session found, hard redirecting to /dashboard')
    window.location.replace('/dashboard')
    return
  }

  console.log('[confirm] no session, setting up onAuthStateChange listener')
  // Fallback: listen for auth state change (e.g. hash-based implicit flow)
  const { data: { subscription } } = client.auth.onAuthStateChange((event, s) => {
    console.log('[confirm] onAuthStateChange:', event, s?.user?.id ?? 'no user')
    if (event === 'SIGNED_IN') {
      subscription.unsubscribe()
      window.location.replace('/dashboard')
    }
  })
})

watch(user, (u) => {
  console.log('[confirm] user watch fired:', u?.id ?? 'null')
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
