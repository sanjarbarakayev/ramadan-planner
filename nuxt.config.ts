export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  css: ['~/assets/css/tailwind.css'],

  components: [
    {
      path: '~/components/ui',
      extensions: ['.vue'],
      prefix: '',
    },
    {
      path: '~/components',
      ignore: ['ui/**'],
    },
  ],

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
    },
    cookieOptions: {
      secure: false,
    },
  },

  routeRules: {
    '/auth/confirm': { ssr: false },
  },

  i18n: {
    locales: [
      { code: 'uz', file: 'uz.json', name: "O'zbekcha" },
      { code: 'ru', file: 'ru.json', name: 'Русский' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'uz',
    langDir: '../i18n/locales',
    lazy: false,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'uz',
    },
  },

  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET ?? '',
    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    public: {
      telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME ?? '',
      telegramBotId: process.env.TELEGRAM_BOT_TOKEN?.split(':')[0] ?? '',
    },
  },

  vite: {
    plugins: [
      (await import('@tailwindcss/vite')).default(),
    ],
  },

  app: {
    head: {
      title: 'Ramazon Rejam',
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js' },
        {
          innerHTML: 'if(window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.initData){document.documentElement.classList.add("tg-loading")}',
        },
      ],
      meta: [
        { name: 'description', content: 'Ramazon oyini rejali va baraka bilan o\'tkazing' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0e2f2b' },
        { property: 'og:title', content: 'Ramazon Rejam' },
        { property: 'og:description', content: 'Ramazon oyini rejali va baraka bilan o\'tkazing' },
        { property: 'og:image', content: 'https://sanjar-ramadan-planner.vercel.app/og-image.png' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Ramazon Rejam' },
        { name: 'twitter:image', content: 'https://sanjar-ramadan-planner.vercel.app/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },
})
