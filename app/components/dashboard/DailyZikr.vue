<script setup lang="ts">
import { DAILY_ZIKR } from '~/data/daily-zikr'

const { t, locale } = useI18n()
const { currentDay } = useRamadanDay()

const todayZikr = computed(() => {
  const day = currentDay.value || 1
  return DAILY_ZIKR.find((z) => z.day === day) ?? DAILY_ZIKR[0]
})

const transliteration = computed(() => {
  if (!todayZikr.value) return ''
  if (locale.value === 'uz' && todayZikr.value.transliterationUz) {
    return todayZikr.value.transliterationUz
  }
  return todayZikr.value.transliteration
})

const meaning = computed(() => {
  if (!todayZikr.value) return ''
  switch (locale.value) {
    case 'ru': return todayZikr.value.meaningRu
    case 'en': return todayZikr.value.meaningEn
    default: return todayZikr.value.meaningUz
  }
})
</script>

<template>
  <Card v-if="todayZikr">
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.dailyZikr') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="rounded-lg bg-primary/5 p-4">
        <p class="text-2xl leading-relaxed text-center font-arabic" dir="rtl">
          {{ todayZikr.arabic }}
        </p>
      </div>
      <p class="text-sm text-center font-medium">
        {{ transliteration }}
      </p>
      <p class="text-sm text-muted-foreground text-center">
        {{ meaning }}
      </p>
      <p class="text-xs text-muted-foreground/60 text-center italic">
        {{ todayZikr.source }}
      </p>
    </CardContent>
  </Card>
</template>
