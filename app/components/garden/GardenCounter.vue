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

const stageBadgeColor = computed(() => {
  if (props.type === 'tulip') {
    switch (props.stage) {
      case 'paradise': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'lush': return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'medium': return 'bg-pink-100 text-pink-800 border-pink-300'
      case 'small': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'sprouts': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-stone-100 text-stone-600 border-stone-300'
    }
  }
  switch (props.stage) {
    case 'paradise': return 'bg-amber-100 text-amber-800 border-amber-300'
    case 'lush': return 'bg-green-100 text-green-800 border-green-300'
    case 'medium': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    case 'small': return 'bg-teal-100 text-teal-800 border-teal-300'
    case 'sprouts': return 'bg-lime-100 text-lime-800 border-lime-300'
    default: return 'bg-stone-100 text-stone-600 border-stone-300'
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Card>
      <CardContent class="p-4 text-center">
        <div class="flex items-center justify-center gap-2">
          <!-- Tulip icon -->
          <svg v-if="type === 'tulip'" viewBox="0 0 24 24" class="w-6 h-6" fill="none">
            <path d="M12,3 Q8,6 9,12 Q10,14 12,13 Q14,14 15,12 Q16,6 12,3Z" fill="#e91e63" />
            <line x1="12" y1="13" x2="12" y2="21" stroke="#4caf50" stroke-width="2" stroke-linecap="round" />
            <path d="M12,16 Q9,14 8,16" fill="none" stroke="#66bb6a" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <!-- Palm icon -->
          <svg v-else viewBox="0 0 24 24" class="w-6 h-6" fill="none">
            <line x1="12" y1="10" x2="12" y2="22" stroke="#795548" stroke-width="2.5" stroke-linecap="round" />
            <path d="M12,10 Q6,4 3,6" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" />
            <path d="M12,10 Q18,4 21,6" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" />
            <path d="M12,10 Q8,2 5,2" fill="none" stroke="#388e3c" stroke-width="1.5" stroke-linecap="round" />
            <path d="M12,10 Q16,2 19,2" fill="none" stroke="#388e3c" stroke-width="1.5" stroke-linecap="round" />
            <path d="M12,10 Q12,3 12,1" fill="none" stroke="#43a047" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span class="text-3xl font-bold">{{ count }}</span>
        </div>
        <p class="text-sm text-muted-foreground mt-1">{{ countLabel }}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="p-4 text-center">
        <p class="text-3xl font-bold" aria-live="polite">{{ percentage }}%</p>
        <span
          class="mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium"
          :class="stageBadgeColor"
        >
          {{ stageLabel }}
        </span>
        <Progress :model-value="percentage" class="mt-2 h-2.5" />
      </CardContent>
    </Card>
  </div>
</template>
