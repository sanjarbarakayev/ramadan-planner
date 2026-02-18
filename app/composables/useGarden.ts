import { GROWTH_STAGE_THRESHOLDS, FLOWER_COUNT_DIVISOR } from '~/utils/constants'

export type GrowthStage = typeof GROWTH_STAGE_THRESHOLDS[number]['stage']

export function useGarden() {
  const { overallPercentage: realPercentage } = useStats()
  const { override: devOverride } = useDevGarden()
  const overallPercentage = computed(() =>
    devOverride.value !== null ? devOverride.value : realPercentage.value
  )

  const growthStage = computed((): GrowthStage => {
    const pct = overallPercentage.value
    const matched = GROWTH_STAGE_THRESHOLDS.find((t) => pct >= t.min)
    return matched?.stage ?? 'barren'
  })

  const gardenType = computed(() => 'palm')

  const flowerCount = computed(() => {
    return Math.floor(overallPercentage.value / FLOWER_COUNT_DIVISOR)
  })

  return {
    growthStage,
    gardenType,
    flowerCount,
    overallPercentage,
  }
}
