<script setup lang="ts">
import type { GrowthStage } from '~/composables/useGarden'

const props = defineProps<{
  stage: GrowthStage
  percentage: number
  treeCount: number
}>()

const stageIndex = computed(() => {
  const stages: GrowthStage[] = ['barren', 'sprouts', 'small', 'medium', 'lush', 'paradise']
  return stages.indexOf(props.stage)
})

// Sky: deep blue top -> warm golden horizon (divine light of Jannah)
const skyColors = computed(() => {
  switch (props.stage) {
    case 'paradise': return { top: '#0a1628', mid: '#1a3a5c', bottom: '#c8943a' }
    case 'lush': return { top: '#0f1e36', mid: '#1c4468', bottom: '#a07830' }
    case 'medium': return { top: '#132840', mid: '#1e4e72', bottom: '#7a6028' }
    case 'small': return { top: '#163050', mid: '#22587a', bottom: '#5a4820' }
    case 'sprouts': return { top: '#1a3858', mid: '#266080', bottom: '#3d3518' }
    default: return { top: '#2a2018', mid: '#4a3828', bottom: '#3a2e1a' }
  }
})

// Green meadow hills instead of sand dunes
const hillColors = computed(() => {
  if (props.stage === 'barren') return { far: '#6a5a3a', mid: '#5a4a2a', front: '#4a3a20' }
  if (props.stage === 'sprouts') return { far: '#5a7a3a', mid: '#4a6a2e', front: '#3d5c24' }
  if (props.stage === 'small') return { far: '#4a8038', mid: '#3d7030', front: '#326028' }
  if (props.stage === 'medium') return { far: '#3d8a35', mid: '#307a2c', front: '#286a24' }
  if (props.stage === 'lush') return { far: '#358830', mid: '#2a7828', front: '#226820' }
  return { far: '#308528', mid: '#267524', front: '#1e6520' }
})

const moonOpacity = computed(() => {
  if (stageIndex.value < 1) return 0
  if (stageIndex.value === 1) return 0.3
  if (stageIndex.value === 2) return 0.6
  return 0.9
})

const stars = [
  { x: 80, y: 30, r: 1.5, delay: 0 },
  { x: 160, y: 55, r: 1, delay: 0.5 },
  { x: 240, y: 22, r: 1.8, delay: 1.2 },
  { x: 320, y: 45, r: 1.2, delay: 0.8 },
  { x: 400, y: 18, r: 1.5, delay: 1.5 },
  { x: 480, y: 40, r: 1, delay: 0.3 },
  { x: 540, y: 28, r: 1.3, delay: 2 },
  { x: 120, y: 70, r: 0.8, delay: 1.8 },
  { x: 350, y: 65, r: 1.1, delay: 0.6 },
  { x: 50, y: 55, r: 0.9, delay: 1.0 },
  { x: 550, y: 60, r: 1.4, delay: 1.4 },
  { x: 200, y: 12, r: 1.0, delay: 2.2 },
]

// Back row palms sit on far hills
const backRow = [
  { x: 85, y: 215, scale: 0.5 },
  { x: 190, y: 208, scale: 0.55 },
  { x: 305, y: 218, scale: 0.5 },
  { x: 410, y: 210, scale: 0.55 },
  { x: 520, y: 216, scale: 0.5 },
]

// Front row palms sit on front ground
const frontRow = [
  { x: 50, y: 300, scale: 1.0 },
  { x: 158, y: 306, scale: 0.95 },
  { x: 278, y: 298, scale: 1.0 },
  { x: 398, y: 304, scale: 0.95 },
  { x: 530, y: 296, scale: 1.0 },
]

// Grass tufts and flowers on the meadow
const grassTufts = [
  { x: 35, y: 348 }, { x: 95, y: 355 }, { x: 145, y: 345 },
  { x: 210, y: 358 }, { x: 265, y: 342 }, { x: 335, y: 352 },
  { x: 385, y: 360 }, { x: 440, y: 346 }, { x: 495, y: 355 },
  { x: 555, y: 348 }, { x: 60, y: 365 }, { x: 180, y: 368 },
  { x: 310, y: 370 }, { x: 425, y: 366 }, { x: 570, y: 362 },
]

// Small flowers (visible from medium stage)
const flowers = [
  { x: 70, y: 342, color: '#fff176' },
  { x: 170, y: 355, color: '#f48fb1' },
  { x: 250, y: 348, color: '#fff176' },
  { x: 365, y: 340, color: '#ce93d8' },
  { x: 475, y: 350, color: '#fff176' },
  { x: 540, y: 345, color: '#f48fb1' },
]

const sparkles = [
  { x: 100, y: 90, delay: 0 },
  { x: 250, y: 50, delay: 0.6 },
  { x: 400, y: 70, delay: 1.2 },
  { x: 150, y: 140, delay: 1.8 },
  { x: 480, y: 120, delay: 0.4 },
  { x: 320, y: 100, delay: 2 },
  { x: 50, y: 130, delay: 1.0 },
  { x: 550, y: 95, delay: 0.8 },
]

const frondAngles = [-70, -50, -30, -10, 10, 30, 50, 70]
</script>

<template>
  <svg viewBox="0 0 600 400" class="block w-full h-auto">
    <defs>
      <!-- Sky gradient: deep blue -> warm golden horizon -->
      <linearGradient id="palm-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="skyColors.top" />
        <stop offset="50%" :stop-color="skyColors.mid" />
        <stop offset="100%" :stop-color="skyColors.bottom" />
      </linearGradient>
      <radialGradient id="moon-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#fffde7" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#fffde7" stop-opacity="0" />
      </radialGradient>
      <!-- River water -->
      <linearGradient id="river-water" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#4fc3f7" stop-opacity="0.2" />
        <stop offset="30%" stop-color="#29b6f6" stop-opacity="0.5" />
        <stop offset="50%" stop-color="#81d4fa" stop-opacity="0.6" />
        <stop offset="70%" stop-color="#29b6f6" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#4fc3f7" stop-opacity="0.2" />
      </linearGradient>
      <!-- Paradise golden glow at horizon -->
      <radialGradient id="horizon-glow" cx="0.5" cy="1" r="0.8">
        <stop offset="0%" stop-color="#ffd54f" stop-opacity="0.5" />
        <stop offset="50%" stop-color="#ffb300" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#ffd54f" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Night sky with warm horizon -->
    <rect width="600" height="400" fill="url(#palm-sky)" />

    <!-- Paradise golden glow at horizon -->
    <ellipse
      v-if="stageIndex >= 4"
      cx="300" cy="220"
      :rx="stageIndex >= 5 ? 350 : 280"
      :ry="stageIndex >= 5 ? 100 : 70"
      fill="url(#horizon-glow)"
    />

    <!-- Stars -->
    <g v-if="stageIndex >= 1">
      <circle
        v-for="(star, i) in stars" :key="'star-' + i"
        :cx="star.x" :cy="star.y" :r="star.r"
        fill="#fffde7"
        class="star-twinkle"
        :style="{ animationDelay: star.delay + 's' }"
      />
    </g>

    <!-- Crescent moon + glow -->
    <g :opacity="moonOpacity">
      <circle cx="510" cy="50" r="45" fill="url(#moon-glow)" />
      <g transform="translate(510, 50)">
        <circle cx="0" cy="0" r="16" fill="#fffde7" />
        <circle cx="6" cy="-4" r="12" :fill="skyColors.top" />
      </g>
    </g>

    <!-- Far green hills -->
    <path
      d="M0,220 Q80,190 170,205 Q290,178 400,198 Q510,182 600,210 L600,400 L0,400Z"
      :fill="hillColors.far"
    />

    <!-- BACK ROW palms (between far and mid hills) -->
    <g v-for="(palm, i) in backRow" :key="'palm-b-' + i">
      <g
        v-if="i < treeCount"
        :transform="`translate(${palm.x}, ${palm.y}) scale(${palm.scale})`"
      >
        <g v-if="stageIndex === 1">
          <rect x="-3" y="-5" width="6" height="20" rx="3" fill="#5d4037" />
          <path d="M0,-5 Q-10,-15 -15,-8" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-5 Q10,-15 15,-8" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-5 Q0,-18 0,-20" fill="none" stroke="#388e3c" stroke-width="2" stroke-linecap="round" />
        </g>
        <g v-if="stageIndex === 2">
          <path d="M0,15 Q2,-10 0,-55" fill="none" stroke="#6d4c41" stroke-width="5" stroke-linecap="round" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#5d4037" stroke-width="1" opacity="0.5" />
          <line x1="-3" y1="-15" x2="3" y2="-15" stroke="#5d4037" stroke-width="1" opacity="0.5" />
          <path d="M0,-55 Q-18,-68 -30,-60" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-55 Q18,-68 30,-60" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-55 Q-12,-72 -22,-68" fill="none" stroke="#388e3c" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-55 Q12,-72 22,-68" fill="none" stroke="#388e3c" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-55 Q0,-72 0,-75" fill="none" stroke="#43a047" stroke-width="1.5" stroke-linecap="round" />
        </g>
        <g v-if="stageIndex === 3">
          <path d="M0,15 Q3,-20 0,-90" fill="none" stroke="#6d4c41" stroke-width="7" stroke-linecap="round" />
          <line v-for="s in 6" :key="'seg-' + s" :x1="-4" :y1="10 - s * 16" :x2="4" :y2="10 - s * 16" stroke="#5d4037" stroke-width="1" opacity="0.4" />
          <path d="M0,-90 Q-25,-108 -42,-98" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-90 Q25,-108 42,-98" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-90 Q-18,-112 -35,-108" fill="none" stroke="#388e3c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-90 Q18,-112 35,-108" fill="none" stroke="#388e3c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-90 Q-10,-115 -20,-115" fill="none" stroke="#43a047" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-90 Q10,-115 20,-115" fill="none" stroke="#43a047" stroke-width="2" stroke-linecap="round" />
          <path d="M0,-90 Q0,-112 0,-118" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" />
          <g transform="translate(0, -88)">
            <circle cx="-6" cy="6" r="2.5" fill="#ff8f00" />
            <circle cx="6" cy="6" r="2.5" fill="#ff8f00" />
            <circle cx="0" cy="8" r="2.5" fill="#f57f17" />
            <circle cx="-3" cy="4" r="2" fill="#ffa000" />
            <circle cx="3" cy="4" r="2" fill="#ffa000" />
          </g>
        </g>
        <g v-if="stageIndex >= 4">
          <path d="M0,15 Q4,-30 0,-120" fill="none" stroke="#6d4c41" stroke-width="8" stroke-linecap="round" />
          <line v-for="s in 8" :key="'seg-' + s" :x1="-5" :y1="10 - s * 16" :x2="5" :y2="10 - s * 16" stroke="#5d4037" stroke-width="1" opacity="0.35" />
          <path
            v-for="(angle, fi) in frondAngles" :key="'frond-' + fi"
            :d="`M0,-120 Q${Math.sin(angle * Math.PI / 180) * 30},${-120 - 20 + Math.abs(angle) * 0.1} ${Math.sin(angle * Math.PI / 180) * 55},${-120 - 10 + Math.abs(angle) * 0.25}`"
            fill="none"
            :stroke="fi % 2 === 0 ? '#2e7d32' : '#388e3c'"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <g v-for="(angle, fi) in frondAngles" :key="'leaflets-' + fi" opacity="0.6">
            <line
              :x1="Math.sin(angle * Math.PI / 180) * 20"
              :y1="-120 - 15 + Math.abs(angle) * 0.05"
              :x2="Math.sin(angle * Math.PI / 180) * 20 + (angle < 0 ? -6 : 6)"
              :y2="-120 - 15 + Math.abs(angle) * 0.05 + 5"
              stroke="#43a047" stroke-width="1" stroke-linecap="round"
            />
          </g>
          <g transform="translate(0, -118)">
            <circle cx="-8" cy="8" r="3" fill="#ff8f00" />
            <circle cx="8" cy="8" r="3" fill="#ff8f00" />
            <circle cx="0" cy="10" r="3" fill="#f57f17" />
            <circle cx="-4" cy="5" r="2.5" fill="#ffa000" />
            <circle cx="4" cy="5" r="2.5" fill="#ffa000" />
            <circle cx="0" cy="6" r="2" fill="#ffb300" />
          </g>
        </g>
      </g>
    </g>

    <!-- Mid green hills (covers back-row trunk bases) -->
    <path
      d="M0,260 Q100,235 220,248 Q350,225 470,242 Q560,230 600,255 L600,400 L0,400Z"
      :fill="hillColors.mid"
    />

    <!-- Flowing river (Jannah: gardens beneath which rivers flow) -->
    <g v-if="stageIndex >= 3">
      <path
        d="M-10,290 Q80,278 160,285 Q260,272 340,280 Q440,268 520,278 Q580,272 610,276"
        fill="none"
        stroke="url(#river-water)"
        :stroke-width="stageIndex >= 4 ? 18 : 12"
        stroke-linecap="round"
        :opacity="stageIndex >= 5 ? 0.8 : stageIndex >= 4 ? 0.6 : 0.4"
      />
      <!-- River highlight shimmer -->
      <path
        d="M-10,289 Q80,277 160,284 Q260,271 340,279 Q440,267 520,277 Q580,271 610,275"
        fill="none"
        stroke="#b3e5fc"
        :stroke-width="stageIndex >= 4 ? 4 : 2"
        stroke-linecap="round"
        :opacity="stageIndex >= 5 ? 0.5 : 0.25"
        class="river-shimmer"
      />
    </g>

    <!-- Front green meadow -->
    <path
      d="M0,305 Q80,290 180,298 Q300,282 420,295 Q540,285 600,300 L600,400 L0,400Z"
      :fill="hillColors.front"
    />

    <!-- Grass tufts on meadow -->
    <g v-if="stageIndex >= 1" :opacity="stageIndex >= 3 ? 0.7 : 0.4">
      <g v-for="(tuft, i) in grassTufts" :key="'grass-' + i">
        <line
          :x1="tuft.x - 3" :y1="tuft.y" :x2="tuft.x - 5" :y2="tuft.y - 8"
          stroke="#43a047" stroke-width="1.5" stroke-linecap="round"
        />
        <line
          :x1="tuft.x" :y1="tuft.y" :x2="tuft.x" :y2="tuft.y - 11"
          stroke="#66bb6a" stroke-width="1.5" stroke-linecap="round"
        />
        <line
          :x1="tuft.x + 3" :y1="tuft.y" :x2="tuft.x + 5" :y2="tuft.y - 8"
          stroke="#43a047" stroke-width="1.5" stroke-linecap="round"
        />
      </g>
    </g>

    <!-- Small flowers on meadow -->
    <g v-if="stageIndex >= 3">
      <g v-for="(flower, i) in flowers" :key="'flower-' + i">
        <circle :cx="flower.x" :cy="flower.y" r="3" :fill="flower.color" :opacity="stageIndex >= 4 ? 0.8 : 0.5" />
        <circle :cx="flower.x" :cy="flower.y" r="1.5" fill="#fff9c4" opacity="0.6" />
      </g>
    </g>

    <!-- FRONT ROW palms -->
    <g v-for="(palm, i) in frontRow" :key="'palm-f-' + i">
      <g
        v-if="(i + 5) < treeCount"
        :transform="`translate(${palm.x}, ${palm.y}) scale(${palm.scale})`"
      >
        <g v-if="stageIndex === 1">
          <rect x="-4" y="-5" width="8" height="24" rx="4" fill="#5d4037" />
          <path d="M0,-5 Q-12,-18 -18,-10" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-5 Q12,-18 18,-10" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-5 Q0,-22 0,-25" fill="none" stroke="#388e3c" stroke-width="2.5" stroke-linecap="round" />
        </g>
        <g v-if="stageIndex === 2">
          <path d="M0,18 Q3,-15 0,-65" fill="none" stroke="#6d4c41" stroke-width="6" stroke-linecap="round" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#5d4037" stroke-width="1" opacity="0.5" />
          <line x1="-3" y1="-18" x2="3" y2="-18" stroke="#5d4037" stroke-width="1" opacity="0.5" />
          <line x1="-3" y1="-36" x2="3" y2="-36" stroke="#5d4037" stroke-width="1" opacity="0.5" />
          <path d="M0,-65 Q-22,-80 -36,-72" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-65 Q22,-80 36,-72" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-65 Q-15,-85 -28,-80" fill="none" stroke="#388e3c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-65 Q15,-85 28,-80" fill="none" stroke="#388e3c" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-65 Q0,-85 0,-90" fill="none" stroke="#43a047" stroke-width="2" stroke-linecap="round" />
        </g>
        <g v-if="stageIndex === 3">
          <path d="M0,18 Q4,-25 0,-110" fill="none" stroke="#6d4c41" stroke-width="8" stroke-linecap="round" />
          <line v-for="s in 7" :key="'seg-' + s" :x1="-4" :y1="12 - s * 17" :x2="4" :y2="12 - s * 17" stroke="#5d4037" stroke-width="1" opacity="0.4" />
          <path d="M0,-110 Q-28,-130 -48,-118" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round" />
          <path d="M0,-110 Q28,-130 48,-118" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round" />
          <path d="M0,-110 Q-20,-135 -40,-130" fill="none" stroke="#388e3c" stroke-width="3" stroke-linecap="round" />
          <path d="M0,-110 Q20,-135 40,-130" fill="none" stroke="#388e3c" stroke-width="3" stroke-linecap="round" />
          <path d="M0,-110 Q-12,-138 -25,-138" fill="none" stroke="#43a047" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-110 Q12,-138 25,-138" fill="none" stroke="#43a047" stroke-width="2.5" stroke-linecap="round" />
          <path d="M0,-110 Q0,-135 0,-140" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" />
          <g transform="translate(0, -108)">
            <circle cx="-7" cy="7" r="3" fill="#ff8f00" />
            <circle cx="7" cy="7" r="3" fill="#ff8f00" />
            <circle cx="0" cy="9" r="3" fill="#f57f17" />
            <circle cx="-3.5" cy="4.5" r="2.5" fill="#ffa000" />
            <circle cx="3.5" cy="4.5" r="2.5" fill="#ffa000" />
          </g>
        </g>
        <g v-if="stageIndex >= 4">
          <path d="M0,18 Q5,-35 0,-140" fill="none" stroke="#6d4c41" stroke-width="9" stroke-linecap="round" />
          <line v-for="s in 9" :key="'seg-' + s" :x1="-5" :y1="12 - s * 16" :x2="5" :y2="12 - s * 16" stroke="#5d4037" stroke-width="1.2" opacity="0.35" />
          <path
            v-for="(angle, fi) in frondAngles" :key="'frond-' + fi"
            :d="`M0,-140 Q${Math.sin(angle * Math.PI / 180) * 35},${-140 - 22 + Math.abs(angle) * 0.12} ${Math.sin(angle * Math.PI / 180) * 65},${-140 - 12 + Math.abs(angle) * 0.3}`"
            fill="none"
            :stroke="fi % 2 === 0 ? '#2e7d32' : '#388e3c'"
            stroke-width="3"
            stroke-linecap="round"
          />
          <g v-for="(angle, fi) in frondAngles" :key="'leaflets-' + fi" opacity="0.6">
            <line
              :x1="Math.sin(angle * Math.PI / 180) * 24"
              :y1="-140 - 16 + Math.abs(angle) * 0.06"
              :x2="Math.sin(angle * Math.PI / 180) * 24 + (angle < 0 ? -7 : 7)"
              :y2="-140 - 16 + Math.abs(angle) * 0.06 + 6"
              stroke="#43a047" stroke-width="1.2" stroke-linecap="round"
            />
            <line
              :x1="Math.sin(angle * Math.PI / 180) * 42"
              :y1="-140 - 14 + Math.abs(angle) * 0.18"
              :x2="Math.sin(angle * Math.PI / 180) * 42 + (angle < 0 ? -8 : 8)"
              :y2="-140 - 14 + Math.abs(angle) * 0.18 + 7"
              stroke="#43a047" stroke-width="1.2" stroke-linecap="round"
            />
          </g>
          <g transform="translate(0, -138)">
            <circle cx="-9" cy="9" r="3.5" fill="#ff8f00" />
            <circle cx="9" cy="9" r="3.5" fill="#ff8f00" />
            <circle cx="0" cy="12" r="3.5" fill="#f57f17" />
            <circle cx="-5" cy="6" r="3" fill="#ffa000" />
            <circle cx="5" cy="6" r="3" fill="#ffa000" />
            <circle cx="0" cy="7" r="2.5" fill="#ffb300" />
            <circle cx="-7" cy="13" r="2.5" fill="#e65100" opacity="0.7" />
            <circle cx="7" cy="13" r="2.5" fill="#e65100" opacity="0.7" />
          </g>
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
      v-if="treeCount === 0"
      x="300" y="200"
      text-anchor="middle"
      fill="#8a7a5a" font-size="16" opacity="0.7"
    >
      {{ $t('garden.stages.barren') }}
    </text>
  </svg>
</template>

<style scoped>
.star-twinkle {
  animation: star-twinkle 3s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.river-shimmer {
  animation: river-shimmer 3s ease-in-out infinite;
}

@keyframes river-shimmer {
  0%, 100% { opacity: 0.2; stroke-dashoffset: 0; }
  50% { opacity: 0.5; }
}

.sparkle-pulse {
  animation: sparkle-pulse 2.5s ease-in-out infinite;
}

@keyframes sparkle-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
