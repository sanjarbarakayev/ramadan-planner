<script setup lang="ts">
import { PRAYER_METHODS } from '~/utils/constants'

const { t } = useI18n()
const { profile, updateProfile } = useProfile()
const { showSuccess, showError } = useAppToast()

const startDate = ref(profile.value?.ramadan_start_date ?? '2026-02-19')
const timeAdj = ref(profile.value?.time_adjustment ?? 0)
const method = ref(String(profile.value?.prayer_method ?? 14))
const saving = ref(false)

watch(() => profile.value, (p) => {
  if (p) {
    startDate.value = p.ramadan_start_date ?? '2026-02-19'
    timeAdj.value = p.time_adjustment ?? 0
    method.value = String(p.prayer_method ?? 14)
  }
})

async function save() {
  saving.value = true
  const result = await updateProfile({
    ramadan_start_date: startDate.value,
    time_adjustment: timeAdj.value,
    prayer_method: parseInt(method.value, 10),
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
      <CardTitle class="text-base">{{ t('settings.ramadan') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label>{{ t('onboarding.ramadanStart') }}</Label>
        <Input v-model="startDate" type="date" />
      </div>
      <div class="space-y-2">
        <Label>{{ t('settings.prayerMethod') }}</Label>
        <Select v-model="method">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="m in PRAYER_METHODS"
              :key="m.id"
              :value="String(m.id)"
            >
              {{ m.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-2">
        <Label>{{ t('settings.timeAdjustment') }}</Label>
        <Input v-model.number="timeAdj" type="number" min="-60" max="60" />
      </div>
      <Button :disabled="saving" @click="save">
        {{ saving ? t('common.loading') : t('settings.save') }}
      </Button>
    </CardContent>
  </Card>
</template>
