<script setup lang="ts">
import type { GrowthStage } from '~/composables/useGarden'
import { GROWTH_STAGES } from '~/utils/constants'

const props = defineProps<{
  stage: GrowthStage
  percentage: number
  flowerCount: number
}>()

const stageIndex = computed(() => {
  return GROWTH_STAGES.indexOf(props.stage)
})

const skyColors = computed(() => {
  switch (props.stage) {
    case 'paradise': return { top: '#fff0d4', bottom: '#ffe0b2' }
    case 'lush': return { top: '#fce4ec', bottom: '#f8bbd0' }
    case 'medium': return { top: '#fce4ec', bottom: '#f5e6d0' }
    case 'small': return { top: '#ffecd2', bottom: '#fcf0e0' }
    case 'sprouts': return { top: '#fef0e4', bottom: '#faf6f0' }
    default: return { top: '#e8e0d8', bottom: '#d7cfc5' }
  }
})

const hillColors = computed(() => {
  if (props.stage === 'barren') return { back: '#c5b8a0', mid: '#bab098', front: '#b8a990' }
  if (props.stage === 'sprouts') return { back: '#c5d4a0', mid: '#b0c890', front: '#a8c085' }
  if (props.stage === 'small') return { back: '#a0c878', mid: '#90be6a', front: '#85b560' }
  return { back: '#8eba6a', mid: '#7aad58', front: '#6da04e' }
})

const groundColor = computed(() => {
  if (props.stage === 'barren') return '#c8b898'
  if (props.stage === 'sprouts') return '#8ab860'
  return '#6a9e48'
})

const sunRadius = computed(() => {
  if (stageIndex.value < 2) return 0
  return 30 + (stageIndex.value - 2) * 12
})

// Back row tulips sit on back hill
const backRow = [
  { x: 95, y: 248, scale: 0.6, color: '#e91e63' },
  { x: 195, y: 242, scale: 0.65, color: '#f44336' },
  { x: 300, y: 250, scale: 0.6, color: '#ec407a' },
  { x: 405, y: 245, scale: 0.65, color: '#d32f2f' },
  { x: 505, y: 252, scale: 0.6, color: '#e91e63' },
]

// Front row tulips sit on front ground
const frontRow = [
  { x: 55, y: 340, scale: 1.0, color: '#c62828' },
  { x: 160, y: 345, scale: 0.95, color: '#e91e63' },
  { x: 280, y: 338, scale: 1.0, color: '#ff5722' },
  { x: 395, y: 343, scale: 0.95, color: '#f44336' },
  { x: 520, y: 336, scale: 1.0, color: '#ec407a' },
]

const grassTufts = [
  { x: 30, y: 358 }, { x: 75, y: 365 }, { x: 130, y: 355 },
  { x: 185, y: 368 }, { x: 240, y: 352 }, { x: 295, y: 362 },
  { x: 350, y: 370 }, { x: 405, y: 356 }, { x: 460, y: 365 },
  { x: 520, y: 358 }, { x: 50, y: 375 }, { x: 115, y: 378 },
  { x: 215, y: 372 }, { x: 330, y: 380 }, { x: 440, y: 375 },
  { x: 490, y: 382 }, { x: 565, y: 368 }, { x: 375, y: 385 },
]

const sparkles = [
  { x: 90, y: 120, delay: 0 },
  { x: 250, y: 80, delay: 0.5 },
  { x: 450, y: 100, delay: 1 },
  { x: 150, y: 200, delay: 1.5 },
  { x: 350, y: 170, delay: 2 },
  { x: 530, y: 140, delay: 0.8 },
  { x: 180, y: 140, delay: 1.2 },
  { x: 480, y: 190, delay: 0.3 },
]
</script>

<template>
  <svg viewBox="0 0 600 400" class="block w-full h-auto" role="img" :aria-label="$t('garden.gardenScene')">
    <title>{{ $t('garden.gardenScene') }}</title>
    <defs>
      <linearGradient id="tulip-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="skyColors.top" />
        <stop offset="100%" :stop-color="skyColors.bottom" />
      </linearGradient>
      <radialGradient id="tulip-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#fff9c4" />
        <stop offset="40%" stop-color="#fff176" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#ffee58" stop-opacity="0" />
      </radialGradient>
      <!-- River water (warm pastel tones for tulip garden) -->
      <linearGradient id="tulip-river" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#81d4fa" stop-opacity="0.15" />
        <stop offset="30%" stop-color="#4fc3f7" stop-opacity="0.45" />
        <stop offset="50%" stop-color="#b3e5fc" stop-opacity="0.55" />
        <stop offset="70%" stop-color="#4fc3f7" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#81d4fa" stop-opacity="0.15" />
      </linearGradient>
    </defs>

    <!-- Sky -->
    <rect width="600" height="400" fill="url(#tulip-sky)" />

    <!-- Sun -->
    <circle
      v-if="stageIndex >= 2"
      cx="520" cy="55"
      :r="sunRadius"
      fill="url(#tulip-sun)"
    />
    <circle
      v-if="stageIndex >= 2"
      cx="520" cy="55"
      :r="sunRadius * 0.35"
      fill="#fff9c4"
      opacity="0.7"
    />

    <!-- Clouds -->
    <g v-if="stageIndex >= 1" :opacity="stageIndex >= 4 ? 0.8 : 0.6">
      <ellipse cx="120" cy="70" rx="48" ry="18" fill="white" opacity="0.8" />
      <ellipse cx="148" cy="60" rx="32" ry="14" fill="white" opacity="0.9" />
      <ellipse cx="90" cy="64" rx="28" ry="12" fill="white" opacity="0.7" />

      <ellipse cx="400" cy="95" rx="42" ry="16" fill="white" opacity="0.7" />
      <ellipse cx="428" cy="86" rx="30" ry="13" fill="white" opacity="0.8" />
      <ellipse cx="375" cy="88" rx="24" ry="11" fill="white" opacity="0.6" />
    </g>

    <!-- Background hill -->
    <path
      d="M0,265 Q80,232 180,248 Q300,222 420,242 Q520,228 600,252 L600,400 L0,400Z"
      :fill="hillColors.back"
    />

    <!-- BACK ROW tulips (between hills for depth) -->
    <g v-for="(tulip, i) in backRow" :key="'tulip-b-' + i">
      <g
        v-if="i < flowerCount"
        :transform="`translate(${tulip.x}, ${tulip.y}) scale(${tulip.scale})`"
      >
        <!-- Sprout -->
        <g v-if="stageIndex === 1">
          <path
            d="M0,0 Q1,-8 0,-18"
            fill="none" stroke="#4caf50" stroke-width="2.5" stroke-linecap="round"
          />
          <path d="M0,-18 Q-4,-24 -2,-28 Q0,-30 2,-28 Q4,-24 0,-18Z" fill="#66bb6a" />
        </g>
        <!-- Small bud -->
        <g v-if="stageIndex === 2">
          <path
            d="M0,0 Q2,-20 0,-50"
            fill="none" stroke="#4caf50" stroke-width="2.5" stroke-linecap="round"
          />
          <path d="M-1,-28 Q-14,-34 -16,-22 Q-12,-20 -1,-24" fill="#66bb6a" />
          <path
            d="M0,-50 Q-5,-56 -4,-64 Q0,-68 4,-64 Q5,-56 0,-50Z"
            :fill="tulip.color" opacity="0.85"
          />
        </g>
        <!-- Medium half-open -->
        <g v-if="stageIndex === 3">
          <path
            d="M0,0 Q2,-30 0,-75"
            fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"
          />
          <path d="M-1,-32 Q-16,-38 -18,-24 Q-14,-20 -1,-27" fill="#66bb6a" />
          <path d="M1,-50 Q16,-56 18,-42 Q14,-38 1,-45" fill="#4caf50" />
          <path d="M0,-75 Q-8,-84 -7,-96 Q0,-100 0,-95" :fill="tulip.color" opacity="0.9" />
          <path d="M0,-75 Q8,-84 7,-96 Q0,-100 0,-95" :fill="tulip.color" opacity="0.8" />
          <path d="M0,-75 Q-3,-88 -2,-96 Q0,-99 2,-96 Q3,-88 0,-75Z" :fill="tulip.color" />
        </g>
        <!-- Full bloom -->
        <g v-if="stageIndex >= 4">
          <path
            d="M0,0 Q3,-30 0,-80"
            fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"
          />
          <path d="M-1,-35 Q-18,-42 -20,-26 Q-16,-22 -1,-30" fill="#66bb6a" />
          <path d="M1,-55 Q18,-62 20,-46 Q16,-42 1,-50" fill="#4caf50" />
          <path d="M0,-80 Q-14,-90 -12,-108 Q-6,-115 0,-105" :fill="tulip.color" opacity="0.85" />
          <path d="M0,-80 Q14,-90 12,-108 Q6,-115 0,-105" :fill="tulip.color" opacity="0.8" />
          <path d="M0,-80 Q-9,-88 -7,-104 Q-2,-110 0,-102" :fill="tulip.color" />
          <path d="M0,-80 Q9,-88 7,-104 Q2,-110 0,-102" :fill="tulip.color" />
          <ellipse cx="0" cy="-100" rx="3" ry="4" fill="#fff9c4" opacity="0.5" />
        </g>
      </g>
    </g>

    <!-- Mid hill (covers back-row bases) -->
    <path
      d="M0,295 Q100,268 220,278 Q350,258 480,272 Q560,262 600,282 L600,400 L0,400Z"
      :fill="hillColors.mid"
    />

    <!-- Flowing river (Jannah: gardens beneath which rivers flow) -->
    <g v-if="stageIndex >= 3">
      <path
        d="M-10,310 Q80,298 160,305 Q260,292 340,300 Q440,288 520,298 Q580,292 610,296"
        fill="none"
        stroke="url(#tulip-river)"
        :stroke-width="stageIndex >= 4 ? 16 : 10"
        stroke-linecap="round"
        :opacity="stageIndex >= 5 ? 0.85 : stageIndex >= 4 ? 0.65 : 0.4"
      />
      <!-- River highlight -->
      <path
        d="M-10,309 Q80,297 160,304 Q260,291 340,299 Q440,287 520,297 Q580,291 610,295"
        fill="none"
        stroke="#e1f5fe"
        :stroke-width="stageIndex >= 4 ? 3 : 1.5"
        stroke-linecap="round"
        :opacity="stageIndex >= 5 ? 0.5 : 0.25"
        class="river-shimmer"
      />
    </g>

    <!-- Front hill -->
    <path
      d="M0,325 Q120,305 250,315 Q380,298 500,310 Q570,302 600,320 L600,400 L0,400Z"
      :fill="hillColors.front"
    />

    <!-- Foreground ground -->
    <path
      d="M0,345 Q100,332 200,340 Q350,328 450,338 Q550,330 600,342 L600,400 L0,400Z"
      :fill="groundColor"
    />

    <!-- Grass tufts -->
    <g v-if="stageIndex >= 1" :opacity="stageIndex >= 3 ? 0.7 : 0.5">
      <g v-for="(tuft, i) in grassTufts" :key="'grass-' + i">
        <line
          :x1="tuft.x - 3" :y1="tuft.y" :x2="tuft.x - 6" :y2="tuft.y - 9"
          stroke="#4caf50" stroke-width="1.5" stroke-linecap="round"
        />
        <line
          :x1="tuft.x" :y1="tuft.y" :x2="tuft.x" :y2="tuft.y - 12"
          stroke="#66bb6a" stroke-width="1.5" stroke-linecap="round"
        />
        <line
          :x1="tuft.x + 3" :y1="tuft.y" :x2="tuft.x + 6" :y2="tuft.y - 9"
          stroke="#4caf50" stroke-width="1.5" stroke-linecap="round"
        />
      </g>
    </g>

    <!-- Fence -->
    <g v-if="stageIndex >= 3" opacity="0.4">
      <line x1="25" y1="322" x2="575" y2="322" stroke="#8d6e63" stroke-width="2.5" />
      <line x1="25" y1="332" x2="575" y2="332" stroke="#8d6e63" stroke-width="2.5" />
      <rect
        v-for="n in 12" :key="'fence-' + n"
        :x="25 + (n - 1) * 50" y="310"
        width="7" height="30" rx="2"
        fill="#a1887f"
      />
    </g>

    <!-- FRONT ROW tulips -->
    <g v-for="(tulip, i) in frontRow" :key="'tulip-f-' + i">
      <g
        v-if="(i + 5) < flowerCount"
        :transform="`translate(${tulip.x}, ${tulip.y}) scale(${tulip.scale})`"
      >
        <!-- Sprout -->
        <g v-if="stageIndex === 1">
          <path
            d="M0,0 Q1,-10 0,-22"
            fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"
          />
          <path d="M0,-22 Q-5,-28 -3,-33 Q0,-36 3,-33 Q5,-28 0,-22Z" fill="#66bb6a" />
        </g>
        <!-- Small bud -->
        <g v-if="stageIndex === 2">
          <path
            d="M0,0 Q2,-25 0,-58"
            fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"
          />
          <path d="M-1,-30 Q-16,-38 -20,-24 Q-15,-20 -1,-26" fill="#66bb6a" />
          <path d="M1,-45 Q14,-52 16,-38 Q12,-34 1,-40" fill="#4caf50" />
          <path
            d="M0,-58 Q-6,-65 -5,-74 Q0,-78 5,-74 Q6,-65 0,-58Z"
            :fill="tulip.color" opacity="0.85"
          />
        </g>
        <!-- Medium half-open -->
        <g v-if="stageIndex === 3">
          <path
            d="M0,0 Q3,-35 0,-85"
            fill="none" stroke="#4caf50" stroke-width="3.5" stroke-linecap="round"
          />
          <path d="M-1,-36 Q-20,-44 -22,-28 Q-17,-24 -1,-32" fill="#66bb6a" />
          <path d="M1,-56 Q20,-64 22,-48 Q17,-44 1,-52" fill="#4caf50" />
          <path d="M0,-85 Q-10,-96 -8,-110 Q0,-115 0,-108" :fill="tulip.color" opacity="0.9" />
          <path d="M0,-85 Q10,-96 8,-110 Q0,-115 0,-108" :fill="tulip.color" opacity="0.8" />
          <path d="M0,-85 Q-4,-100 -3,-110 Q0,-114 3,-110 Q4,-100 0,-85Z" :fill="tulip.color" />
        </g>
        <!-- Full bloom -->
        <g v-if="stageIndex >= 4">
          <path
            d="M0,0 Q3,-35 0,-90"
            fill="none" stroke="#4caf50" stroke-width="3.5" stroke-linecap="round"
          />
          <path d="M-1,-38 Q-20,-46 -24,-30 Q-18,-25 -1,-34" fill="#66bb6a" />
          <path d="M1,-60 Q20,-68 24,-52 Q18,-47 1,-56" fill="#4caf50" />
          <path d="M0,-90 Q-16,-102 -14,-122 Q-7,-130 0,-118" :fill="tulip.color" opacity="0.85" />
          <path d="M0,-90 Q16,-102 14,-122 Q7,-130 0,-118" :fill="tulip.color" opacity="0.8" />
          <path d="M0,-90 Q-10,-100 -8,-118 Q-3,-124 0,-114" :fill="tulip.color" />
          <path d="M0,-90 Q10,-100 8,-118 Q3,-124 0,-114" :fill="tulip.color" />
          <ellipse cx="0" cy="-112" rx="3.5" ry="5" fill="#fff9c4" opacity="0.5" />
        </g>
      </g>
    </g>

    <!-- Butterflies -->
    <g v-if="stageIndex >= 4">
      <g class="butterfly-float">
        <g transform="translate(170, 200)">
          <ellipse cx="-8" cy="-1" rx="9" ry="5.5" fill="#f48fb1" opacity="0.8" transform="rotate(-20)" />
          <ellipse cx="-5" cy="4" rx="6" ry="3" fill="#f8bbd0" opacity="0.7" transform="rotate(-10)" />
          <ellipse cx="8" cy="-1" rx="9" ry="5.5" fill="#f48fb1" opacity="0.8" transform="rotate(20)" />
          <ellipse cx="5" cy="4" rx="6" ry="3" fill="#f8bbd0" opacity="0.7" transform="rotate(10)" />
          <ellipse cx="0" cy="2" rx="1.5" ry="6" fill="#5d4037" />
          <line x1="-1" y1="-4" x2="-5" y2="-10" stroke="#5d4037" stroke-width="0.8" />
          <line x1="1" y1="-4" x2="5" y2="-10" stroke="#5d4037" stroke-width="0.8" />
          <circle cx="-5" cy="-10" r="1" fill="#5d4037" />
          <circle cx="5" cy="-10" r="1" fill="#5d4037" />
        </g>
      </g>
      <g class="butterfly-float" style="animation-delay: -2s">
        <g transform="translate(430, 180)">
          <ellipse cx="-7" cy="-1" rx="8" ry="4.5" fill="#ce93d8" opacity="0.8" transform="rotate(-20)" />
          <ellipse cx="-4" cy="3" rx="5" ry="2.5" fill="#e1bee7" opacity="0.7" transform="rotate(-10)" />
          <ellipse cx="7" cy="-1" rx="8" ry="4.5" fill="#ce93d8" opacity="0.8" transform="rotate(20)" />
          <ellipse cx="4" cy="3" rx="5" ry="2.5" fill="#e1bee7" opacity="0.7" transform="rotate(10)" />
          <ellipse cx="0" cy="2" rx="1.3" ry="5" fill="#5d4037" />
          <line x1="-1" y1="-3" x2="-4" y2="-9" stroke="#5d4037" stroke-width="0.8" />
          <line x1="1" y1="-3" x2="4" y2="-9" stroke="#5d4037" stroke-width="0.8" />
          <circle cx="-4" cy="-9" r="0.9" fill="#5d4037" />
          <circle cx="4" cy="-9" r="0.9" fill="#5d4037" />
        </g>
      </g>
    </g>

    <!-- Paradise sparkles -->
    <g v-if="stage === 'paradise'">
      <g
        v-for="(s, i) in sparkles" :key="'sparkle-' + i"
        class="sparkle-pulse"
        :style="{ animationDelay: s.delay + 's' }"
      >
        <path
          :transform="`translate(${s.x}, ${s.y})`"
          d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2Z"
          fill="#ffd54f" opacity="0.9"
        />
      </g>
    </g>

    <!-- Empty state -->
    <text
      v-if="flowerCount === 0"
      x="300" y="200"
      text-anchor="middle"
      fill="#8d6e63" font-size="16" opacity="0.7"
    >
      {{ $t('garden.stages.barren') }}
    </text>
  </svg>
</template>

<style scoped>
.butterfly-float {
  animation: butterfly-float 4s ease-in-out infinite;
}

@keyframes butterfly-float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(8px, -12px); }
  50% { transform: translate(-4px, -6px); }
  75% { transform: translate(6px, -14px); }
}

.river-shimmer {
  animation: river-shimmer 3s ease-in-out infinite;
}

@keyframes river-shimmer {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}

.sparkle-pulse {
  animation: sparkle-pulse 2.5s ease-in-out infinite;
}

@keyframes sparkle-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.2); }
}

@media (prefers-reduced-motion: reduce) {
  .butterfly-float,
  .river-shimmer,
  .sparkle-pulse {
    animation: none;
  }
}
</style>
