<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import { useSiteSettingsStore } from '~/modules/settings'
import { formatRUB } from '~/core/utils/format-money'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import UiCard from '~/core/components/ui/ui-card.vue'

const { isShowWeeklyLoading, gold, hoursInDay } = storeToRefs(useSiteSettingsStore())

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
          checked-icon="i-heroicons-check-20-solid"
          unchecked-icon="i-heroicons-x-mark-20-solid"
        />
      </div>
    </div>
  </ui-card>
</template>
