<script setup lang="ts">
import { SITEMAP } from '~/core/utils/router/sitemap'
</script>

<template>
  <nuxt-link
    :to="SITEMAP.main.route"
    class="truncate text-sm font-semibold text-highlighted"
  >
    YTDashboard
  </nuxt-link>
</template>
