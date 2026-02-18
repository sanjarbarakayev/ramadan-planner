<script setup lang="ts">
defineProps<{
  variant: 'journal' | 'habits' | 'quran'
  message: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <!-- Journal: notebook + pen -->
    <svg v-if="variant === 'journal'" aria-hidden="true" class="mb-4 h-20 w-20 text-muted-foreground/30" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="16" y="8" width="40" height="56" rx="3" />
      <line x1="24" y1="22" x2="48" y2="22" />
      <line x1="24" y1="30" x2="44" y2="30" />
      <line x1="24" y1="38" x2="40" y2="38" />
      <line x1="24" y1="46" x2="36" y2="46" />
      <line x1="54" y1="48" x2="66" y2="16" stroke-linecap="round" />
      <line x1="52" y1="46" x2="56" y2="50" stroke-linecap="round" />
      <circle cx="67" cy="14" r="2" />
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
