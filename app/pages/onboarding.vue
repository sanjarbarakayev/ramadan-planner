<script setup lang="ts">
import { DEFAULT_HABITS } from '~/utils/constants'

definePageMeta({ middleware: ['auth'] })

const { t, locale, setLocale } = useI18n()
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { completeOnboarding } = useProfile()

const step = ref(1)
const totalSteps = 5
const loading = ref(false)

const form = reactive({
  language: locale.value,
  gender: '' as 'male' | 'female' | '',
  city: '',
  country: '',
  ramadan_start_date: '2026-02-28',
})

function nextStep() {
  if (step.value < totalSteps) {
    step.value++
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--
  }
}

function selectLanguage(lang: string) {
  form.language = lang
  setLocale(lang)
}

async function finish() {
  if (!user.value?.id) return
  loading.value = true

  const theme = form.gender === 'female' ? 'women' : 'men'

  await completeOnboarding({
    gender: form.gender as 'male' | 'female',
    language: form.language,
    theme,
    city: form.city || null,
    country: form.country || null,
    ramadan_start_date: form.ramadan_start_date,
  })

  // Seed default habits
  const habits = DEFAULT_HABITS.map((h) => ({
    user_id: user.value!.id,
    name_uz: h.nameUz,
    name_ru: h.nameRu,
    name_en: h.nameEn,
    category: h.category,
    target_days: h.targetDays,
    sort_order: h.sortOrder,
    is_custom: false,
    is_active: true,
  }))

  await client.from('habits').insert(habits)

  loading.value = false
  await router.push('/dashboard')
}

const canProceed = computed(() => {
  switch (step.value) {
    case 1: return !!form.language
    case 2: return !!form.gender
    case 3: return true
    case 4: return !!form.ramadan_start_date
    case 5: return true
    default: return false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle class="text-center">
          {{ t('onboarding.welcome') }}
        </CardTitle>
        <CardDescription class="text-center">
          {{ t('onboarding.step', { current: step, total: totalSteps }) }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Step 1: Language -->
        <div v-if="step === 1" class="space-y-4">
          <h3 class="text-lg font-medium text-center">
            {{ t('onboarding.selectLanguage') }}
          </h3>
          <div class="grid grid-cols-1 gap-3">
            <Button
              v-for="lang in [
                { code: 'uz', name: 'O\'zbekcha' },
                { code: 'ru', name: 'Русский' },
                { code: 'en', name: 'English' },
              ]"
              :key="lang.code"
              :variant="form.language === lang.code ? 'default' : 'outline'"
              class="h-12"
              @click="selectLanguage(lang.code)"
            >
              {{ lang.name }}
            </Button>
          </div>
        </div>

        <!-- Step 2: Gender -->
        <div v-if="step === 2" class="space-y-4">
          <h3 class="text-lg font-medium text-center">
            {{ t('onboarding.selectGender') }}
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <Button
              :variant="form.gender === 'male' ? 'default' : 'outline'"
              class="h-16 text-lg"
              @click="form.gender = 'male'"
            >
              {{ t('onboarding.male') }}
            </Button>
            <Button
              :variant="form.gender === 'female' ? 'default' : 'outline'"
              class="h-16 text-lg"
              @click="form.gender = 'female'"
            >
              {{ t('onboarding.female') }}
            </Button>
          </div>
        </div>

        <!-- Step 3: Location -->
        <div v-if="step === 3" class="space-y-4">
          <h3 class="text-lg font-medium text-center">
            {{ t('onboarding.selectLocation') }}
          </h3>
          <div class="space-y-3">
            <div class="space-y-2">
              <Label for="city">{{ t('onboarding.city') }}</Label>
              <Input
                id="city"
                v-model="form.city"
                :placeholder="t('onboarding.city')"
              />
            </div>
            <div class="space-y-2">
              <Label for="country">{{ t('onboarding.country') }}</Label>
              <Input
                id="country"
                v-model="form.country"
                :placeholder="t('onboarding.country')"
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Ramadan Start Date -->
        <div v-if="step === 4" class="space-y-4">
          <h3 class="text-lg font-medium text-center">
            {{ t('onboarding.ramadanStart') }}
          </h3>
          <p class="text-sm text-muted-foreground text-center">
            {{ t('onboarding.ramadanStartHint') }}
          </p>
          <Input
            v-model="form.ramadan_start_date"
            type="date"
          />
        </div>

        <!-- Step 5: Confirmation -->
        <div v-if="step === 5" class="space-y-4 text-center">
          <h3 class="text-lg font-medium">
            {{ t('onboarding.confirm') }}
          </h3>
          <div class="rounded-lg bg-muted p-4 text-left space-y-2 text-sm">
            <p>
              <span class="font-medium">{{ t('settings.language') }}:</span>
              {{ form.language === 'uz' ? "O'zbekcha" : form.language === 'ru' ? 'Русский' : 'English' }}
            </p>
            <p>
              <span class="font-medium">{{ t('settings.gender') }}:</span>
              {{ form.gender === 'male' ? t('onboarding.male') : t('onboarding.female') }}
            </p>
            <p v-if="form.city">
              <span class="font-medium">{{ t('onboarding.city') }}:</span>
              {{ form.city }}<span v-if="form.country">, {{ form.country }}</span>
            </p>
            <p>
              <span class="font-medium">{{ t('onboarding.ramadanStart') }}:</span>
              {{ form.ramadan_start_date }}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-between">
        <Button
          v-if="step > 1"
          variant="outline"
          @click="prevStep"
        >
          {{ t('onboarding.back') }}
        </Button>
        <div v-else />

        <Button
          v-if="step < totalSteps"
          :disabled="!canProceed"
          @click="nextStep"
        >
          {{ t('onboarding.next') }}
        </Button>
        <Button
          v-else
          :disabled="loading"
          @click="finish"
        >
          {{ loading ? t('common.loading') : t('onboarding.finish') }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
