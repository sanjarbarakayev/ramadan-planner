<script setup lang="ts">
const props = defineProps<{
  mainText: string
  meaning?: string
  transliteration?: string
  source?: string
  dayLabel?: string
  categoryLabel?: string
  isRtl?: boolean
  cardId?: string
}>()

const patternId = computed(() => `quote-geom-${props.cardId ?? 'default'}`)
</script>

<template>
  <div
    class="quote-card relative overflow-hidden"
    :style="{ width: '540px', height: '540px' }"
  >
    <!-- Dark teal gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#0a2e2e] via-[#0f3d3d] to-[#0a2820]" />

    <!-- Geometric diamond pattern overlay -->
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern :id="patternId" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20,0 L40,20 L20,40 L0,20 Z" fill="none" stroke="#b08518" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
    </svg>

    <!-- Gold stars scattered -->
    <svg aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="50" r="1.5" fill="#dbb84a" />
      <circle cx="480" cy="80" r="1" fill="#dbb84a" />
      <circle cx="100" cy="460" r="1.2" fill="#dbb84a" />
      <circle cx="440" cy="440" r="1.5" fill="#dbb84a" />
      <circle cx="270" cy="30" r="1" fill="#dbb84a" />
      <circle cx="50" cy="270" r="0.8" fill="#dbb84a" />
      <circle cx="490" cy="260" r="1.2" fill="#dbb84a" />
    </svg>

    <!-- Content container -->
    <div class="relative flex h-full flex-col items-center justify-between px-10 py-8">
      <!-- Day badge + category -->
      <div v-if="dayLabel || categoryLabel" class="flex items-center gap-3">
        <span v-if="dayLabel" class="rounded-full bg-[#dbb84a]/20 px-4 py-1 text-xs font-semibold tracking-wide text-[#f2e4a8]">
          {{ dayLabel }}
        </span>
        <span v-if="categoryLabel" class="rounded-full bg-[#c8d5ca]/10 px-3 py-1 text-xs font-medium text-[#c8d5ca]/70">
          {{ categoryLabel }}
        </span>
      </div>

      <!-- Main text -->
      <div class="flex-1 flex items-center">
        <p
          :dir="isRtl ? 'rtl' : undefined"
          :lang="isRtl ? 'ar' : undefined"
          class="text-center font-serif leading-relaxed text-[#f2e4a8]"
          :class="mainText.length > 120 ? 'text-lg' : 'text-2xl'"
          style="text-shadow: 0 0 20px rgba(219,184,74,0.2)"
        >
          {{ mainText }}
        </p>
      </div>

      <!-- Gold decorative divider -->
      <div class="flex w-full items-center justify-center gap-3 py-1">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-[#dbb84a]/40" />
        <svg class="h-3 w-3 text-[#dbb84a]/60" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6,0 L8,4 L12,6 L8,8 L6,12 L4,8 L0,6 L4,4 Z" />
        </svg>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-[#dbb84a]/40" />
      </div>

      <!-- Meaning / translation -->
      <p v-if="meaning" class="text-center text-sm leading-relaxed text-[#c8d5ca]">
        {{ meaning }}
      </p>

      <!-- Transliteration -->
      <p v-if="transliteration" class="mt-1 text-center text-xs italic text-[#c8d5ca]/50">
        {{ transliteration }}
      </p>

      <!-- Source -->
      <p v-if="source" class="mt-2 text-center text-xs font-medium text-[#c8d5ca]/40">
        {{ source }}
      </p>

      <!-- App branding with website -->
      <div class="mt-3 flex flex-col items-center gap-1 opacity-70">
        <div class="flex items-center gap-2">
          <img src="/logo.svg" alt="" class="h-5 w-5 rounded" />
          <span class="text-xs font-bold tracking-widest text-[#f2e4a8]/60">
            RAMAZON REJAM
          </span>
        </div>
        <span class="text-[10px] tracking-wide text-[#c8d5ca]/30">
          ramazon-rejam.vercel.app
        </span>
      </div>
    </div>
  </div>
</template>
