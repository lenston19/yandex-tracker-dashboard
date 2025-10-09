<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useAuthStore } from '~/core/store/use-auth-store'
import { APP_PAGES, UNAUTH_APP_PAGES } from '../../constants/menu'
import { useToggle } from '@vueuse/core'
import { HEROICONS } from '../../constants/heroicons'
import { AsyncModalSlideover } from '../modal'

const { login } = storeToRefs(useAuthStore())
const { organizationId } = storeToRefs(useSiteSettingsStore())

const [isOpen, toggle] = useToggle(false)

const pages = computed(() => (organizationId.value && login.value ? APP_PAGES : UNAUTH_APP_PAGES))
</script>

<template>
  <u-button
    :icon="HEROICONS.BARS_3"
    @click="toggle(true)"
  />

  <async-modal-slideover
    v-model="isOpen"
    :ui="{
      body: 'flex flex-col'
    }"
  >
    <u-navigation-menu
      :items="pages"
      orientation="vertical"
      class="flex-1"
      @click="toggle(false)"
    />

    <u-color-mode-select
      class="w-full"
      :ui="{
        content: 'z-9999'
      }"
    />
  </async-modal-slideover>
</template>
