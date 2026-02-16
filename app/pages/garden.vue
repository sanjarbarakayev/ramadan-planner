<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { t } = useI18n()
const { fetchHabits, fetchEntries } = useHabits()
const { fetchProfile } = useProfile()
const { gardenType, growthStage, flowerCount, overallPercentage } = useGarden()

const gardenTitle = computed(() =>
  gardenType.value === 'tulip' ? t('garden.tulipGarden') : t('garden.palmGrove'),
)

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchHabits(), fetchEntries()])
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">{{ gardenTitle }}</h1>
      <p class="text-sm text-muted-foreground">{{ t('garden.title') }}</p>
    </div>

    <Card class="overflow-hidden py-0">
      <CardContent class="p-0">
        <GardenTulipGarden
          v-if="gardenType === 'tulip'"
          :stage="growthStage"
          :percentage="overallPercentage"
          :flower-count="flowerCount"
        />
        <GardenPalmGrove
          v-else
          :stage="growthStage"
          :percentage="overallPercentage"
          :tree-count="flowerCount"
        />
      </CardContent>
    </Card>

    <GardenCounter
      :type="gardenType"
      :count="flowerCount"
      :stage="growthStage"
      :percentage="overallPercentage"
    />
  </div>
</template>
