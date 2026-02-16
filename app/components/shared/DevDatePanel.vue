<script setup lang="ts">
const { override, isActive, setDate, reset } = useDevDate()
const { currentDay, daysUntil, isBefore, isDuring, isAfter } = useRamadanDay()

const expanded = ref(false)

const presets = [
  { label: '10 kun oldin', date: '2026-02-18' },
  { label: '1-kun', date: '2026-02-28' },
  { label: '5-kun', date: '2026-03-04' },
  { label: '15-kun (50%)', date: '2026-03-14' },
  { label: '25-kun', date: '2026-03-24' },
  { label: '30-kun (oxirgi)', date: '2026-03-29' },
  { label: 'Ramazondan keyin', date: '2026-03-30' },
]

const status = computed(() => {
  if (isBefore.value) return `Ramazongacha ${daysUntil.value} kun`
  if (isDuring.value) return `Ramazon ${currentDay.value}-kun`
  if (isAfter.value) return 'Ramazon tugadi'
  return ''
})
</script>

<template>
  <div class="fixed bottom-4 left-4 z-50">
    <button
      class="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg hover:bg-yellow-400"
      @click="expanded = !expanded"
    >
      DEV {{ isActive ? ':: ' + override : '' }}
    </button>

    <div
      v-if="expanded"
      class="absolute bottom-10 left-0 w-64 rounded-lg border bg-card p-3 shadow-xl"
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-bold text-foreground">Sana Override</span>
        <button
          v-if="isActive"
          class="text-xs text-destructive hover:underline"
          @click="reset()"
        >
          Reset
        </button>
      </div>

      <div class="mb-2 text-xs text-muted-foreground">
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
  </div>
</template>
