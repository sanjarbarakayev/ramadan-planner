<script setup lang="ts">
const { t } = useI18n()
const { profile, updateProfile } = useProfile()
const { showSuccess, showError } = useAppToast()

const gender = ref(profile.value?.gender ?? 'female')
const saving = ref(false)

watch(() => profile.value?.gender, (val) => {
  if (val) gender.value = val
})

async function save() {
  saving.value = true
  const result = await updateProfile({ gender: gender.value as 'male' | 'female' })
  saving.value = false

  if (result.ok) {
    showSuccess('toast.profileSaved')
  } else {
    showError('toast.profileError')
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">{{ t('settings.profile') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label>{{ t('settings.gender') }}</Label>
        <div class="flex gap-3">
          <Button
            :variant="gender === 'male' ? 'default' : 'outline'"
            @click="gender = 'male'"
          >
            {{ t('onboarding.male') }}
          </Button>
          <Button
            :variant="gender === 'female' ? 'default' : 'outline'"
            @click="gender = 'female'"
          >
            {{ t('onboarding.female') }}
          </Button>
        </div>
      </div>
      <Button :disabled="saving" @click="save">
        {{ saving ? t('common.loading') : t('settings.save') }}
      </Button>
    </CardContent>
  </Card>
</template>
