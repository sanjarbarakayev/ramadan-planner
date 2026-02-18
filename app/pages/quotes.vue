<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'onboarding'] })

const { t } = useI18n()
const { currentDay } = useRamadanDay()
const { todayQuote, previousQuotes, getMeaning, getTransliteration, getCategoryLabel } = useQuotes()
const { isGenerating, shareCard, downloadCard, shareTelegram, shareWhatsApp } = useShareQuote()

// Daily quote card ref
const dailyCardRef = ref<HTMLElement | null>(null)

// Custom quote state
const customText = ref('')
const customMeaning = ref('')
const customSource = ref('')
const showCustomCard = ref(false)
const customCardRef = ref<HTMLElement | null>(null)

function handleGenerate() {
  showCustomCard.value = true
}

// -- Daily quote actions --
function buildDailyShareText(): string {
  if (!todayQuote.value) return ''
  const meaning = getMeaning(todayQuote.value)
  return `${todayQuote.value.arabic}\n\n${meaning}\n\n-- ${todayQuote.value.source}`
}

function dailyFileName(): string {
  return `ramadan-day-${currentDay.value}.png`
}

function handleDailyShare() {
  if (!dailyCardRef.value || !todayQuote.value) return
  shareCard({
    cardElement: dailyCardRef.value,
    fileName: dailyFileName(),
    shareText: buildDailyShareText(),
  })
}

function handleDailyDownload() {
  if (!dailyCardRef.value) return
  downloadCard(dailyCardRef.value, dailyFileName())
}

function handleDailyTelegram() {
  if (!dailyCardRef.value) return
  shareTelegram(dailyCardRef.value, dailyFileName(), buildDailyShareText())
}

function handleDailyWhatsApp() {
  shareWhatsApp(buildDailyShareText())
}

// -- Custom quote actions --
function buildCustomShareText(): string {
  const parts = [customText.value.trim()]
  if (customMeaning.value.trim()) {
    parts.push(customMeaning.value.trim())
  }
  if (customSource.value.trim()) {
    parts.push(`-- ${customSource.value.trim()}`)
  }
  return parts.join('\n\n')
}

function handleCustomShare() {
  if (!customCardRef.value) return
  shareCard({
    cardElement: customCardRef.value,
    fileName: 'ramadan-quote.png',
    shareText: buildCustomShareText(),
  })
}

function handleCustomDownload() {
  if (!customCardRef.value) return
  downloadCard(customCardRef.value, 'ramadan-quote.png')
}

function handleCustomTelegram() {
  if (!customCardRef.value) return
  shareTelegram(customCardRef.value, 'ramadan-quote.png', buildCustomShareText())
}

function handleCustomWhatsApp() {
  shareWhatsApp(buildCustomShareText())
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold sm:text-2xl">{{ t('quotes.title') }}</h1>

    <!-- Today's quote card -->
    <template v-if="todayQuote">
      <Card>
        <CardHeader>
          <CardTitle class="text-base">
            {{ t('quotes.todayQuote') }} - {{ t('dashboard.ramadanDay', { day: currentDay }) }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="overflow-x-auto pb-2">
            <div class="mx-auto w-fit">
              <div ref="dailyCardRef">
                <QuotesQuoteCard
                  :main-text="todayQuote.arabic"
                  :meaning="getMeaning(todayQuote)"
                  :transliteration="getTransliteration(todayQuote)"
                  :source="todayQuote.source"
                  :day-label="t('quotes.day', { day: todayQuote.day })"
                  :category-label="getCategoryLabel(todayQuote.category)"
                  :is-rtl="true"
                  :card-id="`daily-${todayQuote.day}`"
                />
              </div>
            </div>
          </div>

          <QuotesQuoteActions
            :is-generating="isGenerating"
            @share="handleDailyShare"
            @download="handleDailyDownload"
            @telegram="handleDailyTelegram"
            @whatsapp="handleDailyWhatsApp"
          />
        </CardContent>
      </Card>
    </template>

    <SharedEmptyState
      v-else
      variant="quotes"
      :message="t('quotes.empty')"
    />

    <!-- Custom quote section -->
    <SharedSectionDivider />

    <QuotesCustomQuoteForm
      v-model:text="customText"
      v-model:meaning="customMeaning"
      v-model:source="customSource"
      @generate="handleGenerate"
    />

    <!-- Custom quote card preview -->
    <template v-if="showCustomCard && customText.trim()">
      <Card>
        <CardHeader>
          <CardTitle class="text-base">
            {{ t('quotes.customPreview') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="overflow-x-auto pb-2">
            <div class="mx-auto w-fit">
              <div ref="customCardRef">
                <QuotesQuoteCard
                  :main-text="customText.trim()"
                  :meaning="customMeaning.trim() || undefined"
                  :source="customSource.trim() || undefined"
                  card-id="custom"
                />
              </div>
            </div>
          </div>

          <QuotesQuoteActions
            :is-generating="isGenerating"
            @share="handleCustomShare"
            @download="handleCustomDownload"
            @telegram="handleCustomTelegram"
            @whatsapp="handleCustomWhatsApp"
          />
        </CardContent>
      </Card>
    </template>

    <!-- Previous quotes -->
    <template v-if="previousQuotes.length > 0">
      <SharedSectionDivider />

      <h2 class="text-lg font-semibold">{{ t('quotes.previousQuotes') }}</h2>

      <div class="space-y-3">
        <Card
          v-for="quote in previousQuotes"
          :key="quote.day"
        >
          <CardContent class="py-4">
            <div class="mb-2 flex items-center gap-2">
              <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {{ t('quotes.day', { day: quote.day }) }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ quote.source }}
              </span>
            </div>
            <p dir="rtl" lang="ar" class="mb-2 text-base leading-relaxed text-foreground/80">
              {{ quote.arabic }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ getMeaning(quote) }}
            </p>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
