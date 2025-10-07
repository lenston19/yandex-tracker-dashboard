<script setup lang="ts">
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiTimeZoneSelect from '../time-zone-select.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <modal-base v-model="model">
    <ui-card>
      <template #header>
        <div class="flex flex-col gap-3">
          <div class="text-lg">Выберите временную зону</div>
          <u-divider />
          <div class="flex flex-col gap-2 text-base italic">
            * Дата/время будет отображаться согласно этой настройке
            <div class="text-red-300">** Данные будут запрашиваться по UTC вне зависимости от этой настройки</div>
          </div>
        </div>
      </template>
      <ui-time-zone-select />
    </ui-card>
  </modal-base>
</template>
