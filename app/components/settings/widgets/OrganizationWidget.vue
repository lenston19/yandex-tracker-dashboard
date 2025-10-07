<script setup lang="ts">
import { useSiteSettingsStore } from '~/stores/use-site-settings-store'
import { useClipboard } from '@vueuse/core'
import { HEROICONS } from '~/constants/heroicons'
import { useModal } from 'vue-final-modal'
import UiCard from '~/components/ui/UiCard.vue'

const { organizationId } = storeToRefs(useSiteSettingsStore())

const toast = useToast()

const { open } = useModal({
  component: defineAsyncComponent(() => import('~/components/settings/modals/SettingsOrganizationIdModal.vue'))
})

const { copy, copied, isSupported } = useClipboard({ source: organizationId })

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
          :color="copied ? 'primary' : 'neutral'"
          :icon="copied ? HEROICONS.CHECK : HEROICONS.CLIPBOARD_DOCUMENT_SOLID"
          class="hover:text-primary"
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
