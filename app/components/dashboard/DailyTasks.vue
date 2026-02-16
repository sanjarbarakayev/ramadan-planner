<script setup lang="ts">
const { t } = useI18n()
const client = useSupabaseClient()
const user = useSupabaseUser()
const { currentDay } = useRamadanDay()

interface DailyTask {
  id: string
  title: string
  completed: boolean
  sort_order: number
}

const tasks = ref<DailyTask[]>([])
const newTask = ref('')
const loading = ref(false)

async function fetchTasks() {
  if (!user.value?.id || currentDay.value === 0) return

  const { data } = await client
    .from('daily_tasks')
    .select('*')
    .eq('user_id', user.value.id)
    .eq('ramadan_day', currentDay.value)
    .order('sort_order')

  tasks.value = (data ?? []) as DailyTask[]
}

async function addTask() {
  if (!user.value?.id || !newTask.value.trim() || currentDay.value === 0) return

  const { data, error } = await client
    .from('daily_tasks')
    .insert({
      user_id: user.value.id,
      ramadan_day: currentDay.value,
      title: newTask.value.trim(),
      sort_order: tasks.value.length,
    })
    .select()
    .single()

  if (!error && data) {
    tasks.value = [...tasks.value, data as DailyTask]
    newTask.value = ''
  }
}

async function toggleTask(task: DailyTask) {
  const newCompleted = !task.completed
  tasks.value = tasks.value.map((t) =>
    t.id === task.id ? { ...t, completed: newCompleted } : t
  )

  await client
    .from('daily_tasks')
    .update({ completed: newCompleted })
    .eq('id', task.id)
}

async function deleteTask(taskId: string) {
  tasks.value = tasks.value.filter((t) => t.id !== taskId)
  await client.from('daily_tasks').delete().eq('id', taskId)
}

onMounted(fetchTasks)
watch(currentDay, fetchTasks)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.dailyTasks') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="tasks.length === 0" class="text-sm text-muted-foreground text-center py-2">
        {{ t('dashboard.noTasks') }}
      </div>

      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-2"
      >
        <Checkbox
          :checked="task.completed"
          @update:checked="toggleTask(task)"
        />
        <span
          class="flex-1 text-sm"
          :class="task.completed ? 'line-through text-muted-foreground' : ''"
        >
          {{ task.title }}
        </span>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 text-muted-foreground hover:text-destructive"
          @click="deleteTask(task.id)"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <form class="flex gap-2" @submit.prevent="addTask">
        <Input
          v-model="newTask"
          :placeholder="t('dashboard.addTask')"
          class="h-8 text-sm"
        />
        <Button type="submit" size="sm" class="h-8" :disabled="!newTask.trim()">
          {{ t('common.add') }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
