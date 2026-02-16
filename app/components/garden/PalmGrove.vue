<script setup lang="ts">
import type { GrowthStage } from '~/composables/useGarden'

const props = defineProps<{
  stage: GrowthStage
  percentage: number
  treeCount: number
}>()

const bgColor = computed(() => {
  switch (props.stage) {
    case 'paradise': return 'color-mix(in oklch, var(--primary) 15%, var(--background))'
    case 'lush': return 'color-mix(in oklch, var(--primary) 12%, var(--background))'
    case 'medium': return 'color-mix(in oklch, var(--primary) 8%, var(--background))'
    case 'small': return 'color-mix(in oklch, var(--primary) 5%, var(--background))'
    case 'sprouts': return 'color-mix(in oklch, var(--primary) 3%, var(--background))'
    default: return 'var(--muted)'
  }
})

const palmPositions = [
  { x: 70, y: 120 }, { x: 150, y: 100 }, { x: 230, y: 115 },
  { x: 310, y: 105 }, { x: 390, y: 110 }, { x: 110, y: 140 },
  { x: 190, y: 130 }, { x: 270, y: 125 }, { x: 350, y: 135 },
  { x: 430, y: 120 },
]
</script>

<template>
  <svg viewBox="0 0 520 320" class="w-full h-auto" :style="{ backgroundColor: bgColor }">
    <!-- Sand/Ground -->
    <ellipse cx="260" cy="290" rx="250" ry="40" style="fill: var(--border)" opacity="0.5" />

    <!-- Palm Trees -->
    <g v-for="(pos, i) in palmPositions" :key="i">
      <template v-if="i < treeCount">
        <!-- Trunk -->
        <path
          :d="`M${pos.x},${pos.y + 40} Q${pos.x + 5},${pos.y + 100} ${pos.x},${pos.y + 160}`"
          fill="none" stroke="#795548" stroke-width="8" stroke-linecap="round"
        />
        <!-- Fronds -->
        <g :transform="`translate(${pos.x}, ${pos.y})`">
          <path d="M0,40 Q-30,20 -50,30" fill="none" stroke="#2e7d32" stroke-width="3" />
          <path d="M0,40 Q30,20 50,30" fill="none" stroke="#2e7d32" stroke-width="3" />
          <path d="M0,40 Q-20,10 -40,5" fill="none" stroke="#388e3c" stroke-width="3" />
          <path d="M0,40 Q20,10 40,5" fill="none" stroke="#388e3c" stroke-width="3" />
          <path d="M0,40 Q-10,5 -25,-10" fill="none" stroke="#43a047" stroke-width="3" />
          <path d="M0,40 Q10,5 25,-10" fill="none" stroke="#43a047" stroke-width="3" />
          <path d="M0,40 Q0,10 0,-5" fill="none" stroke="#4caf50" stroke-width="2" />
          <!-- Dates clusters -->
          <circle cx="-8" cy="48" r="3" fill="#ff8f00" />
          <circle cx="8" cy="48" r="3" fill="#ff8f00" />
          <circle cx="0" cy="52" r="3" fill="#f57f17" />
        </g>
      </template>
    </g>

    <!-- Empty state text -->
    <text v-if="treeCount === 0" x="260" y="180" text-anchor="middle" style="fill: var(--muted-foreground)" font-size="14" opacity="0.7">
      {{ $t('garden.stages.barren') }}
    </text>
  </svg>
</template>
