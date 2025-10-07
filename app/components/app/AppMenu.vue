<script setup lang="ts">
import { useSiteSettingsStore } from '~/stores/use-site-settings-store'
import { useAuthStore } from '~/stores/use-auth-store'
import { pages } from '~/constants/menu'
import { useToggle } from '@vueuse/core'
import { HEROICONS } from '~/constants/heroicons'
import { AsyncModalSlideover } from '../modal'

const { login } = storeToRefs(useAuthStore())
const { organizationId } = storeToRefs(useSiteSettingsStore())

const [isOpen, toggle] = useToggle(false)
</script>

<template>
  <u-button
    :icon="HEROICONS.BARS_3"
    @click="toggle(true)"
  />

  <async-modal-slideover
    v-if="organizationId && login"
    v-model="isOpen"
  >
    <u-navigation-menu
      :items="pages"
      orientation="vertical"
      @click="toggle(false)"
    />
  </async-modal-slideover>
</template>
