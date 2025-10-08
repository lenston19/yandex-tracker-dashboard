<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { formatRUB } from '~/core/utils/format-money'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import { useModal } from 'vue-final-modal'
import UiCard from '~/core/components/ui/ui-card.vue'

const { isShowWeeklyLoading, gold, hoursInDay } = storeToRefs(useSiteSettingsStore())

const { open: openHoursModal } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-hours-in-day-modal.vue'))
})

const { open: openGoldModal } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-gold-modal.vue'))
})

const hoursPlural = computed(() => {
  if (!hoursInDay.value) {
    return 'Выключено'
  }
  return pluralize(hoursInDay.value, HOURS_PLURALIZE)
})
</script>

<template>
  <ui-card title="Основные настройки">
    <div class="flex flex-col gap-2">
      <u-form-field
        label="Часов в день"
        class="w-full"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="text-accent truncate overflow-hidden">
            {{ hoursPlural }}
          </div>

          <u-button
            label="Изменить"
            @click="openHoursModal()"
          />
        </div>
      </u-form-field>
      <u-form-field
        label="Ставка"
        class="w-full"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="text-accent truncate overflow-hidden">
            {{ formatRUB(gold) || 'Пусто' }}
          </div>

          <u-button
            label="Изменить"
            @click="openGoldModal()"
          />
        </div>
      </u-form-field>
      <u-form-field
        label="Недельная загруженность"
        help="Демонстрация потраченного времени на каждый проект в течении недели"
        class="w-full"
      >
        <u-switch
          v-model="isShowWeeklyLoading"
          checked-icon="i-heroicons-check-20-solid"
          unchecked-icon="i-heroicons-x-mark-20-solid"
        />
      </u-form-field>
    </div>
  </ui-card>
</template>
