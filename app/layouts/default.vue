<script setup lang="ts">
const { fetchProfile, themeClass } = useProfile()
const user = useSupabaseUser()
const themeCookie = useCookie('app_theme', { default: () => 'theme-women', maxAge: 60 * 60 * 24 * 90 })

const isDev = import.meta.dev

const appliedTheme = computed(() => {
  if (themeClass.value) return themeClass.value
  return themeCookie.value
})

useHead({
  htmlAttrs: { class: appliedTheme },
})

onMounted(async () => {
  if (user.value) {
    await fetchProfile()
  }
})

watch(appliedTheme, (cls) => {
  themeCookie.value = cls
})
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Desktop Sidebar -->
    <SharedAppSidebar class="hidden lg:flex" />

    <!-- Main Content -->
    <div class="flex flex-1 flex-col">
      <SharedAppHeader />

      <main class="flex-1 overflow-auto p-4 pb-20 lg:p-6 lg:pb-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Nav -->
    <SharedMobileNav class="lg:hidden" />

    <!-- Dev Date Override (dev only) -->
    <SharedDevDatePanel v-if="isDev" />
  </div>
</template>
