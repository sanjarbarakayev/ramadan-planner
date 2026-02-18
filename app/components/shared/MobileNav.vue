<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { to: '/dashboard', label: t('nav.dashboard'), icon: 'home' },
  { to: '/habits', label: t('nav.habits'), icon: 'grid' },
  { to: '/quotes', label: t('nav.quotes'), icon: 'quote' },
  { to: '/settings', label: t('nav.settings'), icon: 'settings' },
])

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card">
    <div class="flex h-16 items-center justify-around">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors"
        :class="isActive(item.to)
          ? 'text-primary'
          : 'text-muted-foreground'"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <template v-if="item.icon === 'home'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </template>
          <template v-if="item.icon === 'grid'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </template>
          <template v-if="item.icon === 'quote'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </template>
          <template v-if="item.icon === 'flower'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5 1.2.7 2 2 2 3.5a4 4 0 01-4 4 4 4 0 01-4-4c0-1.5.8-2.8 2-3.5C8.8 8.8 8 7.5 8 6a4 4 0 014-4zM12 17v5" />
          </template>
          <template v-if="item.icon === 'settings'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </template>
        </svg>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
