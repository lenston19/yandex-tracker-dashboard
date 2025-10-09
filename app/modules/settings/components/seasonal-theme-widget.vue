<script setup lang="ts">
import { useSiteSettingsStore } from '../store/use-site-settings-store'
import UiCard from '~/core/components/ui/ui-card.vue'

const settingsStore = useSiteSettingsStore()
const { seasonalTheme, themeType } = storeToRefs(settingsStore)
</script>

<template>
  <ui-card title="Сезонная тема">
    Если есть готовая тема для сезона, то она появится
    <template #footer>
      <div class="flex items-center gap-2">
        <u-switch
          v-model="seasonalTheme.active"
          :disabled="!!themeType"
        ></u-switch>
        <div class="animate-pulse italic">*Тык*</div>
      </div>
    </template>
  </ui-card>
</template>
