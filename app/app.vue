<script lang="ts" setup>
import { setDefaultOptions } from 'date-fns'
import { ru as dateFnsRu } from 'date-fns/locale'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { ModalsContainer } from 'vue-final-modal'
import { ru } from '@nuxt/ui/locale'

setDefaultOptions({ locale: dateFnsRu })

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
