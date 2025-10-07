<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import UiCard from '~/core/components/ui/ui-card.vue'

const { timeZone } = storeToRefs(useSiteSettingsStore())

const { open } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-time-zone-modal.vue'))
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
