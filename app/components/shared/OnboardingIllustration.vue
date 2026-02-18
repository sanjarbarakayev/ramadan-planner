<script setup lang="ts">
defineProps<{
  step: number
}>()
</script>

<template>
  <div class="flex justify-center mb-2">
    <!-- Step 1: Globe (language) -->
    <svg v-if="step === 1" aria-hidden="true" class="h-16 w-16 text-primary/60" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="32" cy="32" r="22" />
      <ellipse cx="32" cy="32" rx="10" ry="22" />
      <line x1="10" y1="24" x2="54" y2="24" />
      <line x1="10" y1="40" x2="54" y2="40" />
      <line x1="32" y1="10" x2="32" y2="54" />
    </svg>

    <!-- Step 2: Map pin (location) -->
    <svg v-else-if="step === 2" aria-hidden="true" class="h-16 w-16 text-primary/60" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M32,6 Q48,6 48,24 Q48,38 32,56 Q16,38 16,24 Q16,6 32,6 Z" />
      <circle cx="32" cy="24" r="7" />
      <circle cx="32" cy="24" r="2.5" fill="currentColor" opacity="0.3" />
    </svg>

    <!-- Step 3: Crescent + calendar (date) -->
    <svg v-else-if="step === 3" aria-hidden="true" class="h-16 w-16 text-primary/60" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="10" y="16" width="36" height="34" rx="3" />
      <line x1="10" y1="26" x2="46" y2="26" />
      <line x1="20" y1="12" x2="20" y2="20" stroke-linecap="round" />
      <line x1="36" y1="12" x2="36" y2="20" stroke-linecap="round" />
      <circle cx="20" cy="34" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="28" cy="34" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="36" cy="34" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="20" cy="42" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="28" cy="42" r="1.5" fill="currentColor" opacity="0.4" />
      <defs>
        <clipPath id="onb-crescent">
          <path d="M 0,0 L 64,0 L 64,64 L 0,64 Z M 56,12 a 6,6 0 1,1 0,-0.01 Z" clip-rule="evenodd" />
        </clipPath>
      </defs>
      <circle cx="52" cy="12" r="8" fill="currentColor" opacity="0.25" clip-path="url(#onb-crescent)" />
    </svg>

    <!-- Step 4: Checkmark with crescent (confirmation) -->
    <svg v-else-if="step === 4" aria-hidden="true" class="h-16 w-16 text-primary/60" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="32" cy="32" r="22" />
      <path d="M20,32 L28,40 L44,24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <defs>
        <clipPath id="onb-confirm-crescent">
          <path d="M 0,0 L 64,0 L 64,64 L 0,64 Z M 52,8 a 4,4 0 1,1 0,-0.01 Z" clip-rule="evenodd" />
        </clipPath>
      </defs>
      <circle cx="50" cy="8" r="5" fill="currentColor" opacity="0.3" clip-path="url(#onb-confirm-crescent)" />
    </svg>
  </div>
</template>
