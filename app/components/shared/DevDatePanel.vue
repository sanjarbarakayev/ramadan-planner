<script setup lang="ts">
const { override, isActive, setDate, reset } = useDevDate()
const { currentDay, daysUntil, isBefore, isDuring, isAfter } = useRamadanDay()
const { override: gardenOverride, isActive: gardenActive, setPercentage, reset: resetGarden } = useDevGarden()

const expanded = ref(false)

const presets = [
  { label: '10 kun oldin', date: '2026-02-09' },
  { label: '1-kun', date: '2026-02-19' },
  { label: '5-kun', date: '2026-02-23' },
  { label: '15-kun (50%)', date: '2026-03-05' },
  { label: '25-kun', date: '2026-03-15' },
  { label: '30-kun (oxirgi)', date: '2026-03-20' },
  { label: 'Ramazondan keyin', date: '2026-03-21' },
]

const gardenPresets = [
  { label: '0% (bo\'sh)', value: 0 },
  { label: '15% (nihollar)', value: 15 },
  { label: '35% (kichik)', value: 35 },
  { label: '55% (o\'rta)', value: 55 },
  { label: '75% (yashil)', value: 75 },
  { label: '95% (jannat)', value: 95 },
]

const status = computed(() => {
  if (isBefore.value) return `Ramazongacha ${daysUntil.value} kun`
  if (isDuring.value) return `Ramazon ${currentDay.value}-kun`
  if (isAfter.value) return 'Ramazon tugadi'
  return ''
})

function resetAll() {
  reset()
  resetGarden()
}
</script>

<template>
  <div class="fixed bottom-20 left-4 z-50 lg:bottom-4">
    <button
      class="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg hover:bg-yellow-400"
      @click="expanded = !expanded"
    >
      DEV {{ isActive ? ':: ' + override : '' }}{{ gardenActive ? ' :: ' + gardenOverride + '%' : '' }}
    </button>

    <div
      v-if="expanded"
      class="absolute bottom-10 left-0 w-72 rounded-lg border bg-card p-3 shadow-xl max-h-[80vh] overflow-y-auto"
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-bold text-foreground">Dev Panel</span>
        <button
          v-if="isActive || gardenActive"
          class="text-xs text-destructive hover:underline"
          @click="resetAll()"
        >
          Barchasini Reset
        </button>
      </div>

      <!-- Date Override -->
      <div class="mb-3">
        <div class="mb-1 flex items-center justify-between">
          <span class="text-xs font-medium text-foreground">Sana</span>
          <button
            v-if="isActive"
            class="text-xs text-destructive hover:underline"
            @click="reset()"
          >
            Reset
          </button>
        </div>

        <div class="mb-1 text-xs text-muted-foreground">
          {{ status }}
        </div>

        <input
          type="date"
          :value="override ?? ''"
          class="mb-2 w-full rounded border bg-background px-2 py-1 text-xs text-foreground"
          @input="setDate(($event.target as HTMLInputElement).value || null)"
        >

        <div class="space-y-1">
          <button
            v-for="preset in presets"
            :key="preset.date"
            class="block w-full rounded px-2 py-1 text-left text-xs hover:bg-muted"
            :class="override === preset.date ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'"
            @click="setDate(preset.date)"
          >
            {{ preset.label }}
            <span class="text-muted-foreground">({{ preset.date }})</span>
          </button>
        </div>
      </div>

      <div class="my-2 border-t" />

      <!-- Garden Override -->
      <div>
        <div class="mb-1 flex items-center justify-between">
          <span class="text-xs font-medium text-foreground">Bog' progress</span>
          <button
            v-if="gardenActive"
            class="text-xs text-destructive hover:underline"
            @click="resetGarden()"
          >
            Reset
          </button>
        </div>

        <div class="mb-2 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            :value="gardenOverride ?? 0"
            class="h-1.5 w-full cursor-pointer accent-primary"
            @input="setPercentage(Number(($event.target as HTMLInputElement).value))"
          >
          <span class="w-10 text-right text-xs font-mono text-foreground">{{ gardenOverride ?? 0 }}%</span>
        </div>

        <div class="space-y-1">
          <button
            v-for="preset in gardenPresets"
            :key="preset.value"
            class="block w-full rounded px-2 py-1 text-left text-xs hover:bg-muted"
            :class="gardenOverride === preset.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'"
            @click="setPercentage(preset.value)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
