<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import UiCard from '~/components/ui/UiCard.vue'

const { timeZone } = storeToRefs(useSiteSettingsStore())

const { open } = useModal({
  component: defineAsyncComponent(() => import('~/components/settings/modals/SettingsTimeZoneModal.vue'))
})
</script>

<template>
  <ui-card title="Временная зона">
    <div class="">{{ timeZone.key }}</div>
    <template #footer>
      <u-button
        label="Изменить"
        @click="open()"
      />
    </template>
  </ui-card>
</template>
