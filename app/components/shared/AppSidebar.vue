<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { to: '/dashboard', label: t('nav.dashboard'), icon: 'home' },
  { to: '/habits', label: t('nav.habits'), icon: 'grid' },
  { to: '/journal', label: t('nav.journal'), icon: 'book' },
  { to: '/settings', label: t('nav.settings'), icon: 'settings' },
])

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="relative flex w-64 flex-col border-r border-sidebar-border bg-sidebar overflow-hidden">
    <!-- Geometric pattern overlay -->
    <svg aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="sidebar-geom" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M16,0 L32,16 L16,32 L0,16 Z" fill="none" stroke="#b08518" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sidebar-geom)" />
    </svg>
    <div class="flex h-20 items-center gap-3 px-6">
      <img src="/logo.svg" alt="" class="h-10 w-10 rounded-xl ring-2 ring-[#dbb84a]/30" />
      <NuxtLink to="/dashboard" class="text-lg font-bold text-sidebar-foreground">
        {{ t('app.title') }}
      </NuxtLink>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-4">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <template v-if="item.icon === 'home'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </template>
          <template v-if="item.icon === 'grid'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </template>
          <template v-if="item.icon === 'book'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </template>
          <template v-if="item.icon === 'flower'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5 1.2.7 2 2 2 3.5a4 4 0 01-4 4 4 4 0 01-4-4c0-1.5.8-2.8 2-3.5C8.8 8.8 8 7.5 8 6a4 4 0 014-4zM12 17v5" />
          </template>
          <template v-if="item.icon === 'settings'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </template>
        </svg>
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>
