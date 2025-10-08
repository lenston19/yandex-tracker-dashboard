<script setup lang="ts">
import { SITEMAP } from '~/core/utils/router/sitemap'
import { useAuthStore } from '~/core/store/use-auth-store'

const { userName, userAvatarUrl } = storeToRefs(useAuthStore())
</script>

<template>
  <u-button
    variant="subtle"
    :to="{ name: SITEMAP.settings.route.name }"
  >
    <u-user
      :name="userName"
      :avatar="{
        src: userAvatarUrl,
        icon: 'i-heroicons-user'
      }"
      :ui="{
        name: 'truncate whitespace-nowrap'
      }"
    />
  </u-button>
</template>
