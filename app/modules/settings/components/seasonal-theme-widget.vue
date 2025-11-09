<script setup lang="ts">
import { useSiteSettingsStore } from '../store/use-site-settings-store'
import UiCard from '~/core/components/ui/ui-card.vue'

const settingsStore = useSiteSettingsStore()
const { seasonalTheme, isHaveThemeType } = storeToRefs(settingsStore)
</script>

<template>
  <ui-card title="Сезонная тема">
    Если есть готовая тема для сезона, то она появится
    <template #footer>
      <div class="flex items-center gap-2">
        <u-switch
          v-model="seasonalTheme.active"
          :disabled="!isHaveThemeType"
        />
        <div
          class="italic"
          :class="[isHaveThemeType ? 'animate-pulse' : 'opacity-50']"
        >
          *Тык*
        </div>
      </div>
    </template>
  </ui-card>
</template>
