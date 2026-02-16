<script setup lang="ts">
import { HABIT_CATEGORIES } from '~/utils/constants'

const { t } = useI18n()
const { addHabit } = useHabits()

const open = ref(false)
const form = reactive({
  name_uz: '',
  name_ru: '',
  name_en: '',
  category: 'worship' as string,
  target_days: 30,
})

async function handleSubmit() {
  if (!form.name_uz.trim()) return

  await addHabit({
    name_uz: form.name_uz.trim(),
    name_ru: form.name_ru.trim(),
    name_en: form.name_en.trim(),
    category: form.category,
    target_days: form.target_days,
  })

  form.name_uz = ''
  form.name_ru = ''
  form.name_en = ''
  form.category = 'worship'
  form.target_days = 30
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button size="sm">
        {{ t('habits.addHabit') }}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t('habits.addHabit') }}</DialogTitle>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="handleSubmit">
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
        <DialogFooter>
          <Button type="submit" :disabled="!form.name_uz.trim()">
            {{ t('common.add') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
