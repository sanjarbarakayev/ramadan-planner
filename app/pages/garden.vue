<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { t } = useI18n()
const { fetchHabits, fetchEntries } = useHabits()
const { gardenType, growthStage, flowerCount, overallPercentage } = useGarden()
const { profile } = useProfile()

onMounted(async () => {
  await Promise.all([fetchHabits(), fetchEntries()])
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ t('garden.title') }}</h1>

    <Card class="overflow-hidden">
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

    <GardenGardenCounter
      :type="gardenType"
      :count="flowerCount"
      :stage="growthStage"
      :percentage="overallPercentage"
    />
  </div>
</template>
