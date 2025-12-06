<script setup lang="ts">
import { useAuthStore } from '~/core/store/use-auth-store'
import hat from '~/assets/theme/new-year/hat.webp'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'

const { userName, userAvatarUrl } = storeToRefs(useAuthStore())
const { seasonalTheme } = storeToRefs(useSiteSettingsStore())
</script>

<template>
  <u-user
    :name="userName"
    :ui="{
      name: 'truncate whitespace-nowrap'
    }"
  >
    <template #avatar>
      <div class="relative">
        <u-avatar
          :src="userAvatarUrl"
          icon="i-heroicons-user"
        />

        <img
          v-if="seasonalTheme.type === 'new-year'"
          :src="hat"
          class="pointer-events-none absolute -top-3.5 -left-3 -scale-x-100"
          style="transform: scale(1.3)"
          loading="lazy"
        />
      </div>
    </template>
  </u-user>
</template>
