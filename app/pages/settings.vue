<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { t } = useI18n()
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-2xl font-bold">{{ t('settings.title') }}</h1>

    <SettingsLanguageSettings />
    <SettingsLocationSettings />
    <SettingsRamadanSettings />
    <SettingsAccountSettings />
  </div>
</template>
