<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import type { HeatmapWeeks } from '../types'
import UiCard from '~/core/components/ui/ui-card.vue'

const { heatmap } = storeToRefs(useSiteSettingsStore())

const rangeOptions: { label: string; value: HeatmapWeeks }[] = [
  { label: '3 месяца', value: 13 },
  { label: '6 месяцев', value: 27 },
  { label: '9 месяцев', value: 40 },
  { label: '1 год', value: 53 }
]

const selectedRange = computed({
  get: () => rangeOptions.find(o => o.value === heatmap.value.weeks) ?? rangeOptions[1],
  set: opt => {
    if (opt) heatmap.value.weeks = opt.value
  }
})
</script>

<template>
  <ui-card
    title="График активности"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="divide-y divide-default">
      <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Показывать график</p>
          <p class="text-xs text-muted">Heatmap за выбранный период</p>
        </div>
        <u-switch
          v-model="heatmap.show"
          class="shrink-0"
          checked-icon="i-heroicons-check-20-solid"
          unchecked-icon="i-heroicons-x-mark-20-solid"
        />
      </div>

      <div
        v-if="heatmap.show"
        class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium">Период отображения</p>
          <p class="text-xs text-muted">Временной промежуток для графика</p>
        </div>
        <u-select-menu
          v-model="selectedRange"
          :items="rangeOptions"
          class="w-36 shrink-0"
        />
      </div>
    </div>
  </ui-card>
</template>
