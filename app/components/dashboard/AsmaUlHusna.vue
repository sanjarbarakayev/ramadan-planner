<script setup lang="ts">
import { ASMA_UL_HUSNA } from '~/data/asma-ul-husna'

const { t, locale } = useI18n()
const { currentDay } = useRamadanDay()

const todayNames = computed(() => {
  const day = currentDay.value || 1
  let startIndex: number
  let count: number

  if (day <= 20) {
    // Days 1-20: 3 names per day (names 1-60)
    startIndex = (day - 1) * 3
    count = 3
  } else {
    // Days 21-30: 4 names per day (names 61-100)
    startIndex = 60 + (day - 21) * 4
    count = 4
  }

  return ASMA_UL_HUSNA.slice(startIndex, Math.min(startIndex + count, ASMA_UL_HUSNA.length))
})

function getMeaning(name: (typeof ASMA_UL_HUSNA)[number]): string {
  switch (locale.value) {
    case 'ru': return name.meaningRu
    case 'en': return name.meaningEn
    default: return name.meaningUz
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.asmaUlHusna') }}</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div class="overflow-hidden">
        <div
          v-for="name in todayNames"
          :key="name.number"
          class="border-b last:border-b-0"
        >
          <div class="flex items-center gap-3 bg-primary/90 px-4 py-2.5 text-primary-foreground">
            <span class="min-w-6 text-sm font-bold">{{ name.number }}</span>
            <span class="flex-1 font-medium">{{ name.transliteration }}</span>
            <span class="font-arabic text-lg leading-relaxed" dir="rtl">{{ name.arabic }}</span>
          </div>
          <div class="px-4 py-2.5 text-sm leading-relaxed text-foreground/80">
            {{ getMeaning(name) }}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
