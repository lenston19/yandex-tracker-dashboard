<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import { TIME_ZONE_LIST } from '../constants/time-zone'
import { useSiteSettingsStore } from '../store/use-site-settings-store'

const siteSettingsStore = useSiteSettingsStore()
const { timeZone } = storeToRefs(useSiteSettingsStore())
</script>

<template>
  <ui-card title="Временная зона">
    <div class="flex flex-col gap-2 text-xs italic">
      * Дата/время будет отображаться согласно этой настройке
      <div class="text-red-300">** Данные будут запрашиваться по UTC вне зависимости от этой настройки</div>
    </div>
    <template #footer>
      <u-select-menu
        :model-value="timeZone"
        :items="TIME_ZONE_LIST"
        autofocus
        class="w-full"
        @update:model-value="newTimeZone => siteSettingsStore.setTimeZone(newTimeZone)"
      />
    </template>
  </ui-card>
</template>
