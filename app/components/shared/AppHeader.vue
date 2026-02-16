<script setup lang="ts">
const { t, locale, setLocale, locales } = useI18n()
const client = useSupabaseClient()
const router = useRouter()
const { currentDay, isBefore, isDuring, daysUntil } = useRamadanDay()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>)
)

async function signOut() {
  await client.auth.signOut()
  await router.push('/auth/login')
}
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
    <div class="flex items-center gap-3">
      <h2 class="text-lg font-semibold lg:hidden">
        {{ t('app.title') }}
      </h2>

      <Badge v-if="isDuring" variant="secondary" class="text-sm">
        {{ t('dashboard.ramadanDay', { day: currentDay }) }}
      </Badge>
      <Badge v-else-if="isBefore" variant="outline" class="text-sm">
        {{ t('dashboard.daysUntilRamadan', { days: daysUntil }) }}
      </Badge>
    </div>

    <div class="flex items-center gap-2">
      <!-- Locale Switcher -->
      <Select :model-value="locale" @update:model-value="setLocale($event)">
        <SelectTrigger class="w-[110px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="loc in availableLocales"
            :key="loc.code"
            :value="loc.code"
          >
            {{ loc.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- User Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-9 w-9">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="router.push('/settings')">
            {{ t('nav.settings') }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="signOut">
            {{ t('auth.signOut') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
