<script setup lang="ts">
const { t } = useI18n()
const { profile, updateProfile } = useProfile()
const { showSuccess, showError } = useAppToast()

const city = ref(profile.value?.city ?? '')
const country = ref(profile.value?.country ?? '')
const saving = ref(false)

watch(() => profile.value, (p) => {
  if (p) {
    city.value = p.city ?? ''
    country.value = p.country ?? ''
  }
})

async function save() {
  saving.value = true
  const result = await updateProfile({
    city: city.value || null,
    country: country.value || null,
  })
  saving.value = false

  if (result.ok) {
    showSuccess('toast.settingsSaved')
  } else {
    showError('toast.profileError')
  }
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
      <Button :disabled="saving" @click="save">
        {{ saving ? t('common.loading') : t('settings.save') }}
      </Button>
    </CardContent>
  </Card>
</template>
