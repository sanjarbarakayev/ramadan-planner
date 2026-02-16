export type GrowthStage = 'barren' | 'sprouts' | 'small' | 'medium' | 'lush' | 'paradise'

export function useGarden() {
  const { overallPercentage } = useStats()
  const { profile } = useProfile()

  const growthStage = computed((): GrowthStage => {
    const pct = overallPercentage.value
    if (pct >= 90) return 'paradise'
    if (pct >= 70) return 'lush'
    if (pct >= 50) return 'medium'
    if (pct >= 30) return 'small'
    if (pct >= 10) return 'sprouts'
    return 'barren'
  })

  const gardenType = computed(() => {
    return profile.value?.gender === 'male' ? 'palm' : 'tulip'
  })

  const flowerCount = computed(() => {
    return Math.floor(overallPercentage.value / 10)
  })

  return {
    growthStage,
    gardenType,
    flowerCount,
    overallPercentage,
  }
}
