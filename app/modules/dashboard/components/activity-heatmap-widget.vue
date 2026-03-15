<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import { useActivityHeatmapStore } from '../store/use-activity-heatmap-store'
import { useSiteSettingsStore } from '~/modules/settings'
import HeatmapChart from '~/core/components/charts/heatmap-chart.vue'

const store = useActivityHeatmapStore()
const { dayMap, isLoading } = storeToRefs(store)
const { heatmap } = storeToRefs(useSiteSettingsStore())

const TITLE_MAP: Record<number, string> = {
  13: 'Активность за 3 месяца',
  27: 'Активность за 6 месяцев',
  40: 'Активность за 9 месяцев',
  53: 'Активность за год'
}

const title = computed(() => TITLE_MAP[heatmap.value.weeks] ?? 'Активность')
</script>

<template>
  <ui-card
    :title="title"
    :ui="{ body: 'sm:px-0 sm:pt-0' }"
  >
    <heatmap-chart
      :week-count="heatmap.weeks"
      :day-map="dayMap"
      :format-tooltip="store.formatTooltip"
      :loading="isLoading"
    />

    <template #footer>
      <worklog-actions
        class="ml-auto w-fit"
        :refresh="store.refresh"
        :loading="isLoading"
      />
    </template>
  </ui-card>
</template>
