<script setup lang="ts">
import { useSiteSettingsStore } from '../store/use-site-settings-store'
import { useClipboard } from '@vueuse/core'
import { HEROICONS } from '~/core/constants/heroicons'
import { useModal } from 'vue-final-modal'
import UiCard from '~/core/components/ui/ui-card.vue'

const { organizationId } = storeToRefs(useSiteSettingsStore())

const toast = useToast()

const { open } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-organization-id-modal.vue'))
})

const { copy, copied, isSupported } = useClipboard({ source: organizationId.value! })

function copyWithToast() {
  copy()
  toast.add({
    title: 'Скопировано',
    color: 'success'
  })
}
</script>

<template>
  <ui-card title="ID Организации">
    <div class="flex items-center gap-4">
      <div class="text-accent truncate overflow-hidden">
        {{ organizationId || 'Пусто' }}
      </div>
      <u-tooltip
        v-if="organizationId && isSupported"
        :text="copied ? '' : 'Скопировать'"
        :delay-duration="0"
      >
        <u-button
          variant="link"
          :color="copied ? 'success' : 'neutral'"
          :icon="copied ? HEROICONS.CHECK : HEROICONS.CLIPBOARD_DOCUMENT_SOLID"
          class="hover:text-success"
          :disabled="copied"
          @click="copyWithToast"
        />
      </u-tooltip>
    </div>

    <template #footer>
      <u-button
        :label="organizationId ? 'Изменить' : 'Добавить'"
        @click="open()"
      />
    </template>
  </ui-card>
</template>
