<script lang="ts" setup>
import { Settings } from 'luxon'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { ModalsContainer } from 'vue-final-modal'
import { ru } from '@nuxt/ui/locale'

const siteSettingsStore = useSiteSettingsStore()
Settings.defaultLocale = 'ru'

watch(
  () => siteSettingsStore.timeZone.value,
  value => {
    Settings.defaultZone = value
  }
)

useHead({
  title: SITEMAP.main.name
})
</script>

<template>
  <u-app
    :locale="ru"
    :toaster="{
      class: 'z-max',
      position: 'bottom-right'
    }"
  >
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>

    <client-only>
      <modals-container />
    </client-only>
  </u-app>
</template>
