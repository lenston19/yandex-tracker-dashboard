import { readFileSync } from 'fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appVersion = packageJson.version

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0'
        },
        {
          name: 'format-detection',
          content: 'telephone=no, date=no, address=no, email=no'
        }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  nitro: {
    prerender: {
      routes: ['/changelog']
    }
  },

  plugins: ['~/plugins/version-check', '~/plugins/vue-final-modal', '~/plugins/apexcharts'],

  runtimeConfig: {
    public: {
      yandexClientId: process.env.NUXT_PUBLIC_YANDEX_CLIENT_ID || '',
      appVersion: appVersion || '1.0.0',
      themeType: process.env.NUXT_PUBLIC_THEME_TYPE
    }
  },

  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxt/eslint', '@nuxt/ui', '@nuxt/content'],

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai'
          }
        }
      }
    }
  },

  colorMode: {
    preference: 'dark'
  },

  icon: {
    provider: 'iconify'
  },

  css: ['~/assets/styles/main.css', 'vue-final-modal/style.css'],

  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 30 * 12
    }
  },

  experimental: {
    payloadExtraction: false,
    defaults: {
      nuxtLink: {
        prefetch: false
      }
    }
  },

  srcDir: 'app/',

  dir: {
    layouts: 'core/views'
  }
})
