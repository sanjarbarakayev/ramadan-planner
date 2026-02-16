<script setup lang="ts">
import type { GrowthStage } from '~/composables/useGarden'

const { t } = useI18n()

const props = defineProps<{
  type: 'tulip' | 'palm'
  count: number
  stage: GrowthStage
  percentage: number
}>()

const stageLabel = computed(() => t(`garden.stages.${props.stage}`))
const countLabel = computed(() =>
  props.type === 'tulip' ? t('garden.bloomed') : t('garden.grown')
)
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Card>
      <CardContent class="p-4 text-center">
        <p class="text-3xl font-bold">{{ count }}</p>
        <p class="text-sm text-muted-foreground">{{ countLabel }}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="p-4 text-center">
        <p class="text-3xl font-bold">{{ percentage }}%</p>
        <p class="text-sm text-muted-foreground">{{ stageLabel }}</p>
        <Progress :model-value="percentage" class="mt-2 h-2" />
      </CardContent>
    </Card>
  </div>
</template>
