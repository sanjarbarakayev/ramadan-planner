<script setup lang="ts">
const { t } = useI18n()
const { showSuccess, showError } = useAppToast()
const { currentDay } = useRamadanDay()
const {
  tasks,
  loading,
  addTask: addTaskAction,
  toggleTask: toggleTaskAction,
  updateTaskTitle,
  deleteTask: deleteTaskAction,
  fetchTasks,
} = useDailyTasks()

const newTask = ref('')
const editingId = ref<string | null>(null)
const editingTitle = ref('')

async function handleAddTask() {
  const result = await addTaskAction(newTask.value)
  if (result.ok) {
    newTask.value = ''
    showSuccess('toast.taskAdded')
  } else {
    showError('toast.taskError')
  }
}

async function handleToggleTask(taskId: string) {
  const result = await toggleTaskAction(taskId)
  if (!result.ok) {
    showError('toast.taskError')
  }
}

function startEdit(task: { id: string; title: string }) {
  editingId.value = task.id
  editingTitle.value = task.title
}

async function saveEdit(taskId: string) {
  const trimmed = editingTitle.value.trim()
  if (!trimmed) {
    editingId.value = null
    return
  }

  editingId.value = null
  const result = await updateTaskTitle(taskId, trimmed)
  if (!result.ok) {
    showError('toast.taskError')
  }
}

function cancelEdit() {
  editingId.value = null
}

async function handleDeleteTask(taskId: string) {
  const result = await deleteTaskAction(taskId)
  if (!result.ok) {
    showError('toast.taskError')
  }
}

watch(currentDay, fetchTasks)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('dashboard.dailyTasks') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="flex items-center gap-2">
          <Skeleton class="h-4 w-4 rounded" />
          <Skeleton class="h-4 flex-1" />
        </div>
      </template>
      <template v-else>
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
          @update:checked="handleToggleTask(task.id)"
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
            @click="handleDeleteTask(task.id)"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      </template>

      <form v-if="!loading" class="flex gap-2" @submit.prevent="handleAddTask">
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
