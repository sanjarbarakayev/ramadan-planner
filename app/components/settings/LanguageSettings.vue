<script setup lang="ts">
const { t, locale, setLocale, locales } = useI18n()
const { updateProfile } = useProfile()

const saving = ref(false)
const saved = ref(false)

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>)
)

async function changeLanguage(code: string) {
  saving.value = true
  setLocale(code)
  await updateProfile({ language: code })
  saving.value = false
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('settings.language') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="loc in availableLocales"
          :key="loc.code"
          :variant="locale === loc.code ? 'default' : 'outline'"
          @click="changeLanguage(loc.code)"
        >
          {{ loc.name }}
        </Button>
      </div>
      <span v-if="saved" class="mt-2 block text-sm text-primary">{{ t('settings.saved') }}</span>
    </CardContent>
  </Card>
</template>
