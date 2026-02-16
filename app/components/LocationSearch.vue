<script setup lang="ts">
import { useDebounceFn, onClickOutside } from '@vueuse/core'

interface CityResult {
  id: number
  city: string
  country: string
  lat: number
  lng: number
}

const emit = defineEmits<{
  select: [location: { city: string; country: string; lat: number; lng: number }]
}>()

const { t } = useI18n()

const searchQuery = ref('')
const results = ref<CityResult[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const selectedDisplay = ref('')
const containerRef = ref<HTMLElement>()

onClickOutside(containerRef, () => {
  isOpen.value = false
})

const search = useDebounceFn(async (query: string) => {
  if (query.length < 2) {
    results.value = []
    isOpen.value = false
    return
  }

  isLoading.value = true
  try {
    const data = await $fetch<CityResult[]>('/api/cities', {
      params: { q: query },
    })
    results.value = data
    isOpen.value = data.length > 0
  } catch {
    results.value = []
  } finally {
    isLoading.value = false
  }
}, 300)

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  selectedDisplay.value = ''
  search(value)
}

function selectCity(city: CityResult) {
  selectedDisplay.value = `${city.city}, ${city.country}`
  searchQuery.value = selectedDisplay.value
  isOpen.value = false
  results.value = []
  emit('select', {
    city: city.city,
    country: city.country,
    lat: city.lat,
    lng: city.lng,
  })
}
</script>

<template>
  <div ref="containerRef" class="relative">
    <div class="relative">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <Input
        :model-value="searchQuery"
        :placeholder="t('onboarding.searchCity')"
        class="pl-9"
        @input="onInput"
      />
      <svg
        v-if="isLoading"
        class="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md"
    >
      <button
        v-for="city in results"
        :key="city.id"
        type="button"
        class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md"
        @click="selectCity(city)"
      >
        <svg
          class="size-4 shrink-0 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{{ city.city }}, <span class="text-muted-foreground">{{ city.country }}</span></span>
      </button>
    </div>
  </div>
</template>
