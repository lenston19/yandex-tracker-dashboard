<script setup lang="ts">
import { useAuthStore } from '~/core/store/use-auth-store'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { HEROICONS } from '~/core/constants/heroicons'

const siteSettingsStore = useSiteSettingsStore()
const authStore = useAuthStore()
const model = defineModel<boolean>()

const logout = (close: () => void) => {
  siteSettingsStore.clearState()
  authStore.clearState()
  close()
}
</script>

<template>
  <modal-base
    v-slot="{ close }"
    v-model="model"
    :ui="{
      content: 'max-w-90'
    }"
  >
    <ui-card title="Выйти из аккаунта?">
      <div class="flex w-full justify-end gap-4">
        <u-button
          color="error"
          label="Выйти"
          :icon="HEROICONS.ARROW_RIGHT_START_ON_RECTANGLE"
          @click="logout(close)"
        />
      </div>
    </ui-card>
  </modal-base>
</template>
