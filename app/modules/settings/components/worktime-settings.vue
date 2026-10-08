<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import { useSiteSettingsStore } from '~/modules/settings'
import { HEROICONS } from '~/core/constants/heroicons'
import { formatRUB } from '~/core/utils/format-money'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import UiCard from '~/core/components/ui/ui-card.vue'
import { TIME_ZONE_LIST } from '../models/constants/time-zone'

const siteSettingsStore = useSiteSettingsStore()
const { isShowWeeklyLoading, gold, hoursInDay, timeZone } = storeToRefs(siteSettingsStore)

const { open: openHoursModal } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-hours-in-day-modal.vue'))
})
const { open: openGoldModal } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-gold-modal.vue'))
})

const hoursPlural = computed(() => (hoursInDay.value ? pluralize(hoursInDay.value, HOURS_PLURALIZE) : 'Выключено'))
</script>

<template>
  <ui-card
    title="Рабочее время"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="divide-y divide-default">
      <div class="flex justify-between gap-4 px-2 py-1.5 max-lg:flex-col lg:items-center lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Временная зона</p>
          <p class="text-xs text-muted">
            Дата и время отображаются согласно этой настройке. Данные запрашиваются по UTC.
          </p>
        </div>
        <u-select-menu
          :model-value="timeZone"
          :items="TIME_ZONE_LIST"
          class="w-48 shrink-0"
          @update:model-value="siteSettingsStore.setTimeZone"
        />
      </div>

      <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Часов в день</p>
          <p class="text-xs text-muted">Стандартная продолжительность рабочего дня</p>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <span class="text-sm text-muted">{{ hoursPlural }}</span>
          <u-button
            size="sm"
            label="Изменить"
            @click="openHoursModal()"
          />
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Ставка</p>
          <p class="text-xs text-muted">Почасовая ставка для расчёта заработка</p>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <span class="text-sm text-muted">{{ formatRUB(gold) || 'Не указана' }}</span>
          <u-button
            size="sm"
            label="Изменить"
            @click="openGoldModal()"
          />
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Недельная загруженность</p>
          <p class="text-xs text-muted">Показывать потраченное время на каждый проект в течение недели</p>
        </div>
        <u-switch
          v-model="isShowWeeklyLoading"
          class="shrink-0"
          :checked-icon="HEROICONS.CHECK_20_SOLID"
          :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
        />
      </div>
    </div>
  </ui-card>
</template>
