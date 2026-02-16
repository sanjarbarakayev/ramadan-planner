<script setup lang="ts">
const { t } = useI18n()
const { profile, updateProfile } = useProfile()

const gender = ref(profile.value?.gender ?? 'female')
const saving = ref(false)
const saved = ref(false)

watch(() => profile.value?.gender, (val) => {
  if (val) gender.value = val
})

async function save() {
  saving.value = true
  await updateProfile({ gender: gender.value as 'male' | 'female' })
  saving.value = false
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
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
      <div class="flex items-center gap-2">
        <Button :disabled="saving" @click="save">
          {{ saving ? t('common.loading') : t('settings.save') }}
        </Button>
        <span v-if="saved" class="text-sm text-primary">{{ t('settings.saved') }}</span>
      </div>
    </CardContent>
  </Card>
</template>
