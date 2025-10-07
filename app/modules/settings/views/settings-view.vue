<script setup lang="ts">
import OrganizationWidget from '../components/organization-widget.vue'
import UserWidget from '../components/user-widget.vue'
import TimeZoneWidget from '../components/time-zone-widget.vue'
import MainSettingsWidget from '../components/main-settings-widget.vue'
import { SITEMAP } from '~/core/utils/router/sitemap/index'

useHead({
  title: SITEMAP.settings.name
})

const authStore = useAuthStore()

const { mySelf } = storeToRefs(authStore)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <user-widget />
    <organization-widget />
    <time-zone-widget v-if="mySelf" />
    <main-settings-widget
      v-if="mySelf"
      class="col-span-auto lg:col-span-3"
    />
  </div>
</template>
