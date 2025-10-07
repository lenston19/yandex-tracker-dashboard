<script setup lang="ts">
import { SITEMAP } from '~/helpers/router/sitemap'
import { useAuthStore } from '~/stores/use-auth-store'

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
    />
  </u-button>
</template>
