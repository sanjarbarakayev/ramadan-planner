<script setup lang="ts">
const { t } = useI18n()

const customText = defineModel<string>('text', { default: '' })
const customMeaning = defineModel<string>('meaning', { default: '' })
const customSource = defineModel<string>('source', { default: '' })

const emit = defineEmits<{
  generate: []
}>()

const hasContent = computed(() => customText.value.trim().length > 0)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">
        {{ t('quotes.customQuote') }}
      </CardTitle>
      <p class="text-sm text-muted-foreground">
        {{ t('quotes.customHint') }}
      </p>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="space-y-1.5">
        <label class="text-sm font-medium">
          {{ t('quotes.customText') }}
        </label>
        <Textarea
          v-model="customText"
          :placeholder="t('quotes.customTextPlaceholder')"
          class="min-h-[80px] resize-none"
          :maxlength="300"
          dir="auto"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">
          {{ t('quotes.customMeaning') }}
        </label>
        <Textarea
          v-model="customMeaning"
          :placeholder="t('quotes.customMeaningPlaceholder')"
          class="min-h-[60px] resize-none"
          :maxlength="200"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">
          {{ t('quotes.customSource') }}
        </label>
        <Input
          v-model="customSource"
          :placeholder="t('quotes.customSourcePlaceholder')"
          :maxlength="100"
        />
      </div>

      <Button
        size="sm"
        :disabled="!hasContent"
        class="w-full"
        @click="emit('generate')"
      >
        {{ t('quotes.generateCard') }}
      </Button>
    </CardContent>
  </Card>
</template>
