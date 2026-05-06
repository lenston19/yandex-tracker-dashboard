<script setup lang="ts">
import TimerButton from '~/core/components/timer/timer-button.vue'
import AppUser from '~/core/components/app/app-user.vue'
import { APP_PAGES, UNAUTH_APP_PAGES } from '~/core/constants/menu'
import { useSiteSettingsStore } from '~/modules/settings'
import { useAuthStore } from '~/core/store/use-auth-store'

const { login, userName } = storeToRefs(useAuthStore())
const { organizationId } = storeToRefs(useSiteSettingsStore())

const pages = computed(() => (organizationId.value && login.value ? APP_PAGES : UNAUTH_APP_PAGES))
</script>

<template>
  <div class="flex h-full flex-col px-3 py-2">
    <u-navigation-menu
      :items="pages"
      orientation="vertical"
      class="w-full"
    />

    <div
      v-if="userName"
      class="mt-auto flex flex-col gap-1 border-t border-default pt-3"
    >
      <timer-button class="w-full" />
      <div class="w-full rounded-md bg-primary/20 px-2 py-1">
        <app-user />
      </div>
      <u-color-mode-select
        class="w-full"
        :ui="{ content: 'z-9999' }"
      />
    </div>
  </div>
</template>
