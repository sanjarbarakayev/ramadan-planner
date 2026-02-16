<script setup lang="ts">
const { t } = useI18n()
const { profile, updateProfile } = useProfile()

const city = ref(profile.value?.city ?? '')
const country = ref(profile.value?.country ?? '')
const saving = ref(false)
const saved = ref(false)

watch(() => profile.value, (p) => {
  if (p) {
    city.value = p.city ?? ''
    country.value = p.country ?? ''
  }
})

async function save() {
  saving.value = true
  await updateProfile({
    city: city.value || null,
    country: country.value || null,
  })
  saving.value = false
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('settings.location') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label>{{ t('onboarding.city') }}</Label>
          <Input v-model="city" :placeholder="t('onboarding.city')" />
        </div>
        <div class="space-y-2">
          <Label>{{ t('onboarding.country') }}</Label>
          <Input v-model="country" :placeholder="t('onboarding.country')" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button :disabled="saving" @click="save">
          {{ saving ? t('common.loading') : t('settings.save') }}
        </Button>
        <span v-if="saved" class="text-sm text-primary">{{ t('settings.saved') }}</span>
      </div>
    </CardContent>
  </Card>
</template>
