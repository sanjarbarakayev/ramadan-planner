<script setup lang="ts">
import { SAHUR_DUAS, IFTAR_DUAS, type SahurIftarDua } from '~/data/sahur-iftar-duas'

const { t, locale } = useI18n()

const activeTab = ref<'sahur' | 'iftar'>('sahur')

function getMeaning(dua: SahurIftarDua): string {
  switch (locale.value) {
    case 'ru': return dua.meaningRu
    case 'en': return dua.meaningEn
    default: return dua.meaningUz
  }
}

function getTransliteration(dua: SahurIftarDua): string {
  if (locale.value === 'uz' && dua.transliterationUz) {
    return dua.transliterationUz
  }
  return dua.transliteration
}

const activeDuas = computed(() =>
  activeTab.value === 'sahur' ? SAHUR_DUAS : IFTAR_DUAS
)
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle class="text-base">{{ t('dashboard.sahurIftarDuas') }}</CardTitle>
      <div class="flex gap-2 pt-1">
        <button
          class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
          :class="activeTab === 'sahur'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'"
          @click="activeTab = 'sahur'"
        >
          {{ t('dashboard.sahurDua') }}
        </button>
        <button
          class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
          :class="activeTab === 'iftar'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'"
          @click="activeTab = 'iftar'"
        >
          {{ t('dashboard.iftarDua') }}
        </button>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        v-for="dua in activeDuas"
        :key="dua.id"
        class="space-y-2 rounded-lg bg-primary/5 p-4"
      >
        <p class="text-center text-xl leading-relaxed font-arabic sm:text-2xl" dir="rtl">
          {{ dua.arabic }}
        </p>
        <p class="text-center text-sm font-medium">
          {{ getTransliteration(dua) }}
        </p>
        <p class="text-center text-sm text-muted-foreground">
          {{ getMeaning(dua) }}
        </p>
        <p class="text-center text-xs italic text-muted-foreground/60">
          {{ dua.source }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
