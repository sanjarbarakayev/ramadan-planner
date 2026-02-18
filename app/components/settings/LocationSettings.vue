<script setup lang="ts">
const { t } = useI18n()
const { profile, updateProfile } = useProfile()
const { fetchPrayerTimes } = usePrayerTimes()
const { showSuccess, showError } = useAppToast()

const currentCity = computed(() => {
  if (!profile.value?.city) return null
  const parts = [profile.value.city, profile.value.country].filter(Boolean)
  return parts.join(', ')
})

async function onCitySelect(location: { city: string; country: string; lat: number; lng: number }) {
  const result = await updateProfile({
    city: location.city,
    country: location.country,
    lat: location.lat,
    lng: location.lng,
  })

  if (result.ok) {
    showSuccess('toast.settingsSaved')
    await fetchPrayerTimes()
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
      <div v-if="currentCity" class="text-sm text-muted-foreground">
        {{ currentCity }}
      </div>
      <LocationSearch @select="onCitySelect" />
    </CardContent>
  </Card>
</template>
