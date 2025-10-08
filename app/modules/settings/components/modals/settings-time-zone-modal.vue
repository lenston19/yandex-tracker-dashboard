<script setup lang="ts">
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { TIME_ZONE_LIST } from '../../constants/time-zone'
import { useSiteSettingsStore } from '../../store/use-site-settings-store'

const siteSettingsStore = useSiteSettingsStore()

const modelValue = computed(() => siteSettingsStore.timeZone)

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <modal-base v-model="model">
    <ui-card>
      <template #header>
        <div class="text-lg">Выберите временную зону</div>
      </template>
      <div class="flex flex-col gap-2 text-base italic">
        * Дата/время будет отображаться согласно этой настройке
        <div class="text-red-300">** Данные будут запрашиваться по UTC вне зависимости от этой настройки</div>
      </div>
      <template #footer>
        <u-select-menu
          :model-value="modelValue"
          :items="TIME_ZONE_LIST"
          autofocus
          class="w-full"
          @update:model-value="newTimeZone => siteSettingsStore.setTimeZone(newTimeZone)"
        />
      </template>
    </ui-card>
  </modal-base>
</template>
