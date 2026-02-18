<script setup lang="ts">
defineProps<{
  variant: 'quotes' | 'habits' | 'quran'
  message: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <!-- Quotes: speech bubble with star -->
    <svg v-if="variant === 'quotes'" aria-hidden="true" class="mb-4 h-20 w-20 text-muted-foreground/30" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12,12 L68,12 Q72,12 72,16 L72,48 Q72,52 68,52 L28,52 L18,64 L18,52 L12,52 Q8,52 8,48 L8,16 Q8,12 12,12 Z" fill="currentColor" opacity="0.06" />
      <path d="M12,12 L68,12 Q72,12 72,16 L72,48 Q72,52 68,52 L28,52 L18,64 L18,52 L12,52 Q8,52 8,48 L8,16 Q8,12 12,12 Z" />
      <path d="M40,24 L42,30 L48,30 L43,34 L45,40 L40,36 L35,40 L37,34 L32,30 L38,30 Z" fill="currentColor" opacity="0.15" />
      <path d="M40,24 L42,30 L48,30 L43,34 L45,40 L40,36 L35,40 L37,34 L32,30 L38,30 Z" />
    </svg>

    <!-- Habits: growing seedling -->
    <svg v-else-if="variant === 'habits'" aria-hidden="true" class="mb-4 h-20 w-20 text-muted-foreground/30" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M24,56 L28,70 L52,70 L56,56 Z" />
      <line x1="22" y1="56" x2="58" y2="56" stroke-linecap="round" />
      <path d="M40,56 Q40,44 40,36" stroke-linecap="round" />
      <path d="M40,42 Q28,36 24,24 Q36,28 40,42" fill="currentColor" opacity="0.15" />
      <path d="M40,42 Q28,36 24,24 Q36,28 40,42" />
      <path d="M40,34 Q52,28 56,16 Q44,20 40,34" fill="currentColor" opacity="0.15" />
      <path d="M40,34 Q52,28 56,16 Q44,20 40,34" />
      <circle cx="40" cy="32" r="3" fill="currentColor" opacity="0.1" />
    </svg>

    <!-- Quran: open book -->
    <svg v-else-if="variant === 'quran'" aria-hidden="true" class="mb-4 h-20 w-20 text-muted-foreground/30" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M40,20 Q28,18 14,22 L14,62 Q28,58 40,60 Z" fill="currentColor" opacity="0.06" />
      <path d="M40,20 Q28,18 14,22 L14,62 Q28,58 40,60 Z" />
      <path d="M40,20 Q52,18 66,22 L66,62 Q52,58 40,60 Z" fill="currentColor" opacity="0.06" />
      <path d="M40,20 Q52,18 66,22 L66,62 Q52,58 40,60 Z" />
      <line x1="40" y1="20" x2="40" y2="60" />
      <line x1="20" y1="32" x2="36" y2="30" opacity="0.5" />
      <line x1="20" y1="38" x2="34" y2="36" opacity="0.5" />
      <line x1="20" y1="44" x2="36" y2="42" opacity="0.5" />
      <line x1="44" y1="30" x2="60" y2="32" opacity="0.5" />
      <line x1="46" y1="36" x2="60" y2="38" opacity="0.5" />
      <line x1="44" y1="42" x2="60" y2="44" opacity="0.5" />
      <circle cx="40" cy="14" r="4" opacity="0.3" />
    </svg>

    <p class="text-sm text-muted-foreground">{{ message }}</p>
  </div>
</template>
