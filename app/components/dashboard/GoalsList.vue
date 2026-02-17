<script setup lang="ts">
const { t } = useI18n()
const {
  goals,
  fetchGoals,
  addGoal,
  toggleGoal,
  deleteGoal,
  updateGoal,
  completedCount,
  totalCount,
} = useGoals()

const newGoalTitle = ref('')
const editingId = ref<string | null>(null)
const editingTitle = ref('')

async function handleAddGoal() {
  if (!newGoalTitle.value.trim()) return
  await addGoal({ title: newGoalTitle.value.trim(), category: 'general' })
  newGoalTitle.value = ''
}

function startEdit(goal: { id: string; title: string }) {
  editingId.value = goal.id
  editingTitle.value = goal.title
}

async function saveEdit(goalId: string) {
  const trimmed = editingTitle.value.trim()
  editingId.value = null
  if (!trimmed) return
  await updateGoal(goalId, { title: trimmed })
}

function cancelEdit() {
  editingId.value = null
}

onMounted(fetchGoals)
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle class="text-base">{{ t('dashboard.goals') }}</CardTitle>
      <span v-if="totalCount > 0" class="text-xs text-muted-foreground">
        {{ completedCount }}/{{ totalCount }}
      </span>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="goals.length === 0" class="text-sm text-muted-foreground text-center py-2">
        {{ t('dashboard.noGoals') }}
      </div>

      <div
        v-for="goal in goals"
        :key="goal.id"
        class="group flex items-center gap-2"
      >
        <Checkbox
          :checked="goal.completed"
          @update:checked="toggleGoal(goal.id)"
        />

        <Input
          v-if="editingId === goal.id"
          v-model="editingTitle"
          class="h-7 flex-1 text-sm"
          autofocus
          @keydown.enter="saveEdit(goal.id)"
          @keydown.escape="cancelEdit"
          @blur="saveEdit(goal.id)"
        />
        <span
          v-else
          class="flex-1 text-sm"
          :class="goal.completed ? 'line-through text-muted-foreground' : ''"
        >
          {{ goal.title }}
        </span>

        <div v-if="editingId !== goal.id" class="flex shrink-0">
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            @click="startEdit(goal)"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
            @click="deleteGoal(goal.id)"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      <form class="flex gap-2" @submit.prevent="handleAddGoal">
        <Input
          v-model="newGoalTitle"
          :placeholder="t('dashboard.addGoal')"
          class="h-8 text-sm"
        />
        <Button type="submit" size="sm" class="h-8" :disabled="!newGoalTitle.trim()">
          {{ t('common.add') }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
