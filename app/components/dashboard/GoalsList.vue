<script setup lang="ts">
const { t } = useI18n()
const client = useSupabaseClient()
const user = useSupabaseUser()

interface Goal {
  id: string
  title: string
  description: string
  completed: boolean
}

const goals = ref<Goal[]>([])
const newGoal = ref('')

async function fetchGoals() {
  if (!user.value?.id) return

  const { data } = await client
    .from('goals')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at')

  goals.value = (data ?? []) as Goal[]
}

async function addGoal() {
  if (!user.value?.id || !newGoal.value.trim()) return

  const { data, error } = await client
    .from('goals')
    .insert({
      user_id: user.value.id,
      title: newGoal.value.trim(),
    })
    .select()
    .single()

  if (!error && data) {
    goals.value = [...goals.value, data as Goal]
    newGoal.value = ''
  }
}

async function toggleGoal(goal: Goal) {
  const newCompleted = !goal.completed
  goals.value = goals.value.map((g) =>
    g.id === goal.id ? { ...g, completed: newCompleted } : g
  )

  await client
    .from('goals')
    .update({ completed: newCompleted })
    .eq('id', goal.id)
}

async function deleteGoal(goalId: string) {
  goals.value = goals.value.filter((g) => g.id !== goalId)
  await client.from('goals').delete().eq('id', goalId)
}

onMounted(fetchGoals)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.goals') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="goals.length === 0" class="text-sm text-muted-foreground text-center py-2">
        {{ t('dashboard.noGoals') }}
      </div>

      <div
        v-for="goal in goals"
        :key="goal.id"
        class="flex items-center gap-2"
      >
        <Checkbox
          :checked="goal.completed"
          @update:checked="toggleGoal(goal)"
        />
        <span
          class="flex-1 text-sm"
          :class="goal.completed ? 'line-through text-muted-foreground' : ''"
        >
          {{ goal.title }}
        </span>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 text-muted-foreground hover:text-destructive"
          @click="deleteGoal(goal.id)"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <form class="flex gap-2" @submit.prevent="addGoal">
        <Input
          v-model="newGoal"
          :placeholder="t('dashboard.addGoal')"
          class="h-8 text-sm"
        />
        <Button type="submit" size="sm" class="h-8" :disabled="!newGoal.trim()">
          {{ t('common.add') }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
