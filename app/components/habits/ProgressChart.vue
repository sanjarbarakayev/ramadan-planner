<script setup lang="ts">
const { t } = useI18n()
const { dailyCompletionData } = useStats()

const data = computed(() => dailyCompletionData())

const chartWidth = 500
const chartHeight = 200
const padding = { top: 20, right: 20, bottom: 30, left: 40 }
const innerWidth = chartWidth - padding.left - padding.right
const innerHeight = chartHeight - padding.top - padding.bottom

const totalDays = 30

const points = computed(() => {
  return data.value.map((d) => {
    const x = padding.left + ((d.day - 1) / (totalDays - 1)) * innerWidth
    const y = padding.top + innerHeight - (d.percentage / 100) * innerHeight
    return { x, y, day: d.day, percentage: d.percentage }
  })
})

const linePath = computed(() => {
  if (points.value.length === 0) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L${last.x},${padding.top + innerHeight} L${first.x},${padding.top + innerHeight} Z`
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('habits.progress') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="w-full h-auto">
        <!-- Y axis lines -->
        <line
          v-for="tick in [0, 25, 50, 75, 100]"
          :key="tick"
          :x1="padding.left"
          :y1="padding.top + innerHeight - (tick / 100) * innerHeight"
          :x2="padding.left + innerWidth"
          :y2="padding.top + innerHeight - (tick / 100) * innerHeight"
          stroke="currentColor"
          stroke-opacity="0.1"
          stroke-width="1"
        />
        <!-- Y axis labels -->
        <text
          v-for="tick in [0, 25, 50, 75, 100]"
          :key="`label-${tick}`"
          :x="padding.left - 5"
          :y="padding.top + innerHeight - (tick / 100) * innerHeight + 4"
          text-anchor="end"
          fill="currentColor"
          fill-opacity="0.5"
          font-size="10"
        >
          {{ tick }}%
        </text>

        <!-- Area fill -->
        <path
          v-if="points.length > 0"
          :d="areaPath"
          fill="currentColor"
          fill-opacity="0.1"
          class="text-primary"
        />

        <!-- Line -->
        <path
          v-if="points.length > 0"
          :d="linePath"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-primary"
        />

        <!-- Points -->
        <circle
          v-for="p in points"
          :key="p.day"
          :cx="p.x"
          :cy="p.y"
          r="3"
          fill="currentColor"
          class="text-primary"
        />

        <!-- X axis labels (always show full 30-day range) -->
        <text
          v-for="day in [1, 5, 10, 15, 20, 25, 30]"
          :key="`x-${day}`"
          :x="padding.left + ((day - 1) / (totalDays - 1)) * innerWidth"
          :y="chartHeight - 5"
          text-anchor="middle"
          fill="currentColor"
          fill-opacity="0.5"
          font-size="10"
        >
          {{ day }}
        </text>
      </svg>
    </CardContent>
  </Card>
</template>
