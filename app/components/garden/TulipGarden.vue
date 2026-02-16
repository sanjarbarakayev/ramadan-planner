<script setup lang="ts">
import type { GrowthStage } from '~/composables/useGarden'

const props = defineProps<{
  stage: GrowthStage
  percentage: number
  flowerCount: number
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

const tulipPositions = [
  { x: 80, y: 220 }, { x: 160, y: 230 }, { x: 240, y: 215 },
  { x: 320, y: 225 }, { x: 400, y: 210 }, { x: 120, y: 250 },
  { x: 200, y: 260 }, { x: 280, y: 245 }, { x: 360, y: 255 },
  { x: 440, y: 240 },
]
</script>

<template>
  <svg viewBox="0 0 520 320" class="w-full h-auto" :style="{ backgroundColor: bgColor }">
    <!-- Ground -->
    <ellipse cx="260" cy="290" rx="250" ry="40" style="fill: var(--border)" opacity="0.3" />

    <!-- Grass -->
    <rect v-if="stage !== 'barren'" x="10" y="270" width="500" height="50" rx="10" fill="#a5d6a7" opacity="0.5" />

    <!-- Tulips -->
    <g v-for="(pos, i) in tulipPositions" :key="i">
      <template v-if="i < flowerCount">
        <!-- Stem -->
        <line
          :x1="pos.x" :y1="pos.y" :x2="pos.x" :y2="pos.y + 60"
          stroke="#4caf50" stroke-width="3"
          class="transition-all duration-700"
        />
        <!-- Leaves -->
        <path
          :d="`M${pos.x},${pos.y + 30} Q${pos.x - 15},${pos.y + 20} ${pos.x - 20},${pos.y + 35}`"
          fill="none" stroke="#66bb6a" stroke-width="2"
        />
        <!-- Tulip flower -->
        <g :transform="`translate(${pos.x}, ${pos.y})`">
          <path d="M0,-5 Q-12,5 -10,20 Q-5,25 0,20 Q5,25 10,20 Q12,5 0,-5Z"
            :fill="['#e91e63', '#f44336', '#ff5722', '#e91e63', '#c62828', '#d32f2f', '#e91e63', '#f44336', '#ff5722', '#e91e63'][i]"
            class="transition-all duration-500"
          />
        </g>
      </template>
    </g>

    <!-- Empty state text -->
    <text v-if="flowerCount === 0" x="260" y="180" text-anchor="middle" style="fill: var(--muted-foreground)" font-size="14" opacity="0.7">
      {{ $t('garden.stages.barren') }}
    </text>
  </svg>
</template>
