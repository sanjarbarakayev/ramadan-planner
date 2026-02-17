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
        { name: 'description', content: 'Ramazon oyida odatlarni kuzatish va ibodat rejasi' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
