<script setup lang="ts">
import { journalEntrySchema } from '~/utils/validation'

definePageMeta({ middleware: ['auth', 'onboarding'] })

const { t } = useI18n()
const { showSuccess, showError } = useAppToast()
const { currentDay } = useRamadanDay()
const { sortedEntries, todayEntry, loading, fetchEntries, saveEntry, deleteEntry } = useJournal()

const content = ref('')
const saving = ref(false)

watch(todayEntry, (entry) => {
  if (entry) {
    content.value = entry.content
  }
}, { immediate: true })

const charCount = computed(() => content.value.length)
const isOverLimit = computed(() => charCount.value > 500)

async function handleSave() {
  const parsed = journalEntrySchema.safeParse({ content: content.value })
  if (!parsed.success) {
    showError('toast.validationError')
    return
  }

  saving.value = true
  const result = await saveEntry(content.value)
  saving.value = false

  if (result.ok) {
    showSuccess('toast.journalSaved')
  } else {
    showError('toast.journalError')
  }
}

async function handleDelete(id: string) {
  const result = await deleteEntry(id)
  if (result.ok) {
    if (todayEntry.value === null) {
      content.value = ''
    }
    showSuccess('toast.journalDeleted')
  } else {
    showError('toast.journalError')
  }
}

onMounted(() => {
  fetchEntries()
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl sm:text-2xl font-bold">{{ t('journal.title') }}</h1>

    <Card v-if="currentDay > 0">
      <CardHeader>
        <CardTitle class="text-base">
          {{ t('dashboard.ramadanDay', { day: currentDay }) }}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <Textarea
          v-model="content"
          :placeholder="t('journal.prompt')"
          class="min-h-[120px] resize-none"
          :maxlength="500"
        />
        <div class="flex items-center justify-between">
          <span
            class="text-xs"
            :class="isOverLimit ? 'text-destructive' : 'text-muted-foreground'"
          >
            {{ t('journal.charCount', { count: charCount, max: 500 }) }}
          </span>
          <Button
            size="sm"
            :disabled="saving || content.trim().length === 0 || isOverLimit"
            @click="handleSave"
          >
            {{ t('journal.save') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <SharedSectionDivider v-if="!loading && sortedEntries.length > 0" />

    <div v-if="loading" class="text-sm text-muted-foreground text-center py-8">
      {{ t('common.loading') }}
    </div>

    <SharedEmptyState
      v-else-if="sortedEntries.length === 0"
      variant="journal"
      :message="t('journal.empty')"
    />

    <div v-else class="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
      <div
        v-for="entry in sortedEntries"
        :key="entry.id"
        class="relative"
      >
        <div class="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
          <div class="h-2 w-2 rounded-full bg-primary-foreground" />
        </div>
        <Card>
          <CardContent class="py-4">
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {{ t('journal.dayLabel', { day: entry.ramadan_day }) }}
              </span>
              <button
                class="text-xs text-muted-foreground hover:text-destructive transition-colors"
                @click="handleDelete(entry.id)"
              >
                {{ t('common.delete') }}
              </button>
            </div>
            <p class="text-sm whitespace-pre-wrap">{{ entry.content }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
