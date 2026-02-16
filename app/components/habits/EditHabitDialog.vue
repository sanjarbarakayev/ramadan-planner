<script setup lang="ts">
import { HABIT_CATEGORIES } from '~/utils/constants'
import type { Habit } from '~/composables/useHabits'

const { t } = useI18n()
const { updateHabit, deleteHabit } = useHabits()

const props = defineProps<{
  habit: Habit
}>()

const emit = defineEmits<{
  close: []
}>()

const open = ref(true)
const form = reactive({
  name_uz: props.habit.name_uz,
  name_ru: props.habit.name_ru,
  name_en: props.habit.name_en,
  category: props.habit.category,
  target_days: props.habit.target_days,
})

async function handleSave() {
  await updateHabit(props.habit.id, {
    name_uz: form.name_uz.trim(),
    name_ru: form.name_ru.trim(),
    name_en: form.name_en.trim(),
    category: form.category,
    target_days: form.target_days,
  })
  open.value = false
  emit('close')
}

async function handleDelete() {
  await deleteHabit(props.habit.id)
  open.value = false
  emit('close')
}

watch(open, (val) => {
  if (!val) emit('close')
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t('habits.editHabit') }}</DialogTitle>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="space-y-2">
          <Label>{{ t('habits.habitName') }} (UZ)</Label>
          <Input v-model="form.name_uz" required />
        </div>
        <div class="space-y-2">
          <Label>{{ t('habits.habitName') }} (RU)</Label>
          <Input v-model="form.name_ru" />
        </div>
        <div class="space-y-2">
          <Label>{{ t('habits.habitName') }} (EN)</Label>
          <Input v-model="form.name_en" />
        </div>
        <div class="space-y-2">
          <Label>{{ t('habits.category') }}</Label>
          <Select v-model="form.category">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cat in HABIT_CATEGORIES" :key="cat" :value="cat">
                {{ t(`habits.categories.${cat}`) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-2">
          <Label>{{ t('habits.targetDays') }}</Label>
          <Input v-model.number="form.target_days" type="number" min="1" max="30" />
        </div>
        <DialogFooter class="flex justify-between">
          <Button type="button" variant="destructive" @click="handleDelete">
            {{ t('habits.deleteHabit') }}
          </Button>
          <Button type="submit">
            {{ t('common.save') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
