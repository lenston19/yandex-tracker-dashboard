<script setup lang="ts">
import type { LineChartData } from '../../types'
import VueApexCharts from 'vue3-apexcharts'
import UiEmptyState from '../ui/ui-empty-state.vue'
import { useApexChart } from '~/core/composables/use-apex-chart'

const props = withDefaults(
  defineProps<{
    data: LineChartData
    loading: boolean
    height?: number
    fill?: boolean
    showLegend?: boolean
  }>(),
  { fill: false, showLegend: false }
)

const { chartHeight, hasData, series, chartOptions, chartWidth } = useApexChart(
  computed(() => props.data),
  computed(() => props.height),
  {
    type: 'line',
    widthMultiplier: 50,
    colorOf: dataset => dataset.borderColor ?? '#1976d2',
    fill: props.fill,
    extraOptions: {
      stroke: { width: 1, curve: 'smooth' },
      legend: { show: props.showLegend }
    }
  }
)
</script>

<template>
  <client-only>
    <div :class="fill ? 'flex h-full flex-col' : undefined">
      <u-skeleton
        v-if="loading"
        :class="fill ? 'size-full flex-1' : 'h-48 w-full'"
      />
      <div
        v-else-if="hasData"
        class="w-full overflow-x-auto overflow-y-hidden"
        :class="fill ? 'min-h-0 flex-1' : undefined"
      >
        <div
          class="max-md:inline-block max-md:min-w-[600px] md:w-full"
          :class="fill ? 'h-full' : undefined"
        >
          <vue-apex-charts
            type="line"
            :height="chartHeight"
            :width="chartWidth"
            :options="chartOptions"
            :series="series"
            class="w-full"
          />
        </div>
      </div>
      <ui-empty-state v-else />
    </div>
  </client-only>
</template>
