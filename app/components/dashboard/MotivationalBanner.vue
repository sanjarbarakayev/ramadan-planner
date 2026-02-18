<script setup lang="ts">
const { t } = useI18n()
const { isBefore, isDuring, daysUntil, currentDay } = useRamadanDay()
const { todayPercentage } = useStats()

const message = computed(() => {
  if (isBefore.value) {
    return t('dashboard.motivational.before')
  }
  const pct = todayPercentage.value
  if (pct >= 80) return t('dashboard.motivational.excellent')
  if (pct >= 50) return t('dashboard.motivational.good')
  if (pct >= 25) return t('dashboard.motivational.average')
  return t('dashboard.motivational.needsWork')
})
</script>

<template>
  <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-md">
    <!-- Decorative: crescent moon -->
    <svg aria-hidden="true" class="absolute -right-2 -top-2 h-28 w-28 opacity-[0.12]" viewBox="0 0 100 100" fill="none">
      <defs>
        <clipPath id="banner-crescent">
          <path d="M 0,0 L 100,0 L 100,100 L 0,100 Z M 60,32 a 18,18 0 1,1 0,-0.01 Z" clip-rule="evenodd" />
        </clipPath>
      </defs>
      <circle cx="50" cy="45" r="28" fill="currentColor" clip-path="url(#banner-crescent)" />
    </svg>

    <!-- Decorative: lantern silhouette -->
    <svg aria-hidden="true" class="absolute right-20 -bottom-1 h-24 w-12 opacity-[0.08]" viewBox="0 0 40 80" fill="currentColor">
      <rect x="16" y="0" width="8" height="6" rx="1" />
      <rect x="18" y="6" width="4" height="8" />
      <path d="M10,14 Q10,14 10,14 L30,14 Q34,30 34,45 Q34,56 30,60 L10,60 Q6,56 6,45 Q6,30 10,14 Z" />
      <rect x="14" y="60" width="12" height="3" rx="1" />
      <rect x="16" y="63" width="8" height="2" rx="1" />
    </svg>

    <!-- Decorative: scattered stars -->
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 400 100" fill="currentColor">
      <circle cx="320" cy="18" r="1.5" />
      <circle cx="350" cy="45" r="1" />
      <circle cx="280" cy="30" r="1.2" />
      <circle cx="370" cy="70" r="0.8" />
      <circle cx="300" cy="60" r="1" />
      <circle cx="260" cy="15" r="0.7" />
    </svg>

    <div class="relative">
      <h2 v-if="isDuring" class="text-xl font-bold">
        {{ t('dashboard.ramadanDay', { day: currentDay }) }}
      </h2>
      <h2 v-else-if="isBefore" class="text-xl font-bold">
        {{ t('dashboard.daysUntilRamadan', { days: daysUntil }) }}
      </h2>
      <h2 v-else class="text-xl font-bold">
        {{ t('dashboard.ramadanStarted') }}
      </h2>
      <p class="mt-1.5 text-primary-foreground/80">
        {{ message }}
      </p>
    </div>
  </div>
</template>
