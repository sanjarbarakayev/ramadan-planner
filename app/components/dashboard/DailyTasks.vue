<script setup lang="ts">
import { dailyTaskSchema } from '~/utils/validation'

const { t } = useI18n()
const client = useSupabaseClient()
const user = useSupabaseUser()
const session = useSupabaseSession()
const { currentDay } = useRamadanDay()
const { showSuccess, showError } = useAppToast()

function getUserId(): string | undefined {
  return user.value?.id || session.value?.user?.id
}

interface DailyTask {
  id: string
  title: string
  completed: boolean
  sort_order: number
}

const tasks = ref<DailyTask[]>([])
const newTask = ref('')
const editingId = ref<string | null>(null)
const editingTitle = ref('')

async function fetchTasks() {
  const userId = getUserId()
  if (!userId || currentDay.value === 0) return

  const { data } = await client
    .from('daily_tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('ramadan_day', currentDay.value)
    .order('sort_order')

  tasks.value = (data ?? []) as DailyTask[]
}

async function addTask() {
  const userId = getUserId()
  if (!userId || currentDay.value === 0) return

  const parsed = dailyTaskSchema.safeParse({ title: newTask.value.trim() })
  if (!parsed.success) return

  const { data, error } = await client
    .from('daily_tasks')
    .insert({
      user_id: userId,
      ramadan_day: currentDay.value,
      title: parsed.data.title,
      sort_order: tasks.value.length,
    })
    .select()
    .single()

  if (error) {
    showError('toast.taskError')
    return
  }

  if (data) {
    tasks.value = [...tasks.value, data as DailyTask]
    newTask.value = ''
    showSuccess('toast.taskAdded')
  }
}

async function toggleTask(task: DailyTask) {
  const previous = task.completed
  const newCompleted = !previous
  tasks.value = tasks.value.map((t) =>
    t.id === task.id ? { ...t, completed: newCompleted } : t
  )

  const { error } = await client
    .from('daily_tasks')
    .update({ completed: newCompleted })
    .eq('id', task.id)

  if (error) {
    // Rollback
    tasks.value = tasks.value.map((t) =>
      t.id === task.id ? { ...t, completed: previous } : t
    )
    showError('toast.taskError')
  }
}

function startEdit(task: DailyTask) {
  editingId.value = task.id
  editingTitle.value = task.title
}

async function saveEdit(taskId: string) {
  const trimmed = editingTitle.value.trim()
  if (!trimmed) {
    editingId.value = null
    return
  }

  const original = tasks.value.find((t) => t.id === taskId)?.title
  tasks.value = tasks.value.map((t) =>
    t.id === taskId ? { ...t, title: trimmed } : t
  )
  editingId.value = null

  const { error } = await client
    .from('daily_tasks')
    .update({ title: trimmed })
    .eq('id', taskId)

  if (error) {
    tasks.value = tasks.value.map((t) =>
      t.id === taskId ? { ...t, title: original ?? trimmed } : t
    )
    showError('toast.taskError')
  }
}

function cancelEdit() {
  editingId.value = null
}

async function deleteTask(taskId: string) {
  const removed = tasks.value.find((t) => t.id === taskId)
  tasks.value = tasks.value.filter((t) => t.id !== taskId)

  const { error } = await client.from('daily_tasks').delete().eq('id', taskId)

  if (error) {
    if (removed) {
      tasks.value = [...tasks.value, removed]
    }
    showError('toast.taskError')
  }
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
        class="group flex items-center gap-2"
      >
        <Checkbox
          :checked="task.completed"
          @update:checked="toggleTask(task)"
        />

        <Input
          v-if="editingId === task.id"
          v-model="editingTitle"
          class="h-7 flex-1 text-sm"
          autofocus
          @keydown.enter="saveEdit(task.id)"
          @keydown.escape="cancelEdit"
          @blur="saveEdit(task.id)"
        />
        <span
          v-else
          class="flex-1 text-sm"
          :class="task.completed ? 'line-through text-muted-foreground' : ''"
        >
          {{ task.title }}
        </span>

        <div v-if="editingId !== task.id" class="flex shrink-0">
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            @click="startEdit(task)"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
            @click="deleteTask(task.id)"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
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
