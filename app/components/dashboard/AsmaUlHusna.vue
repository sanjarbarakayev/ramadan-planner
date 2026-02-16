<script setup lang="ts">
import { ASMA_UL_HUSNA } from '~/data/asma-ul-husna'

const { t, locale } = useI18n()
const { currentDay } = useRamadanDay()

const todayNames = computed(() => {
  const day = currentDay.value || 1
  const total = ASMA_UL_HUSNA.length
  const perDay = Math.ceil(total / 30)
  const startIndex = (day - 1) * perDay
  return ASMA_UL_HUSNA.slice(startIndex, Math.min(startIndex + perDay, total))
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
