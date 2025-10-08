<script setup lang="ts">
import type { LineChartData } from '../../types'
import VueApexCharts from 'vue3-apexcharts'
import UiEmptyState from '../ui/ui-empty-state.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const props = defineProps<{
  data: LineChartData
  loading: boolean
  height?: number
}>()

const chartHeight = computed(() => props.height ?? 200)

const hasData = computed(() => props.data.datasets.at(0)?.data.reduce((acc, v) => acc + v, 0))

const series = computed(() =>
  props.data.datasets.map(ds => ({
    name: 'Часы',
    data: ds.data
  }))
)

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: chartHeight.value,
    fontFamily: 'inherit',
    parentHeightOffset: 0,
    foreColor: '#B0B0B0',
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  grid: {
    show: true,
    strokeDashArray: 1,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } }
  },
  colors: props.data.datasets.map(ds => ds.borderColor ?? '#1976d2'),
  dataLabels: { enabled: false },
  stroke: { width: 1, curve: 'smooth' },
  xaxis: {
    type: 'category',
    axisTicks: { show: false },
    tooltip: { enabled: false }
  },
  labels: {
    hideOverlappingLabels: true,
    trim: true,
    style: {
      fontSize: '10px'
    }
  },
  yaxis: {
    opposite: false,
    labels: { show: true }
  },
  legend: { show: false },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '12px',
      fontFamily: 'inherit'
    },
    x: { show: false }
  }
}))

const { isSmaller } = useBreakpoints(breakpointsTailwind)
</script>

<template>
  <client-only>
    <u-skeleton
      v-if="loading"
      class="h-48 w-full"
    />
    <div
      v-else-if="hasData"
      class="w-full overflow-x-auto overflow-y-hidden"
    >
      <div class="max-md:inline-block max-md:min-w-[600px] md:w-full">
        <vue-apex-charts
          type="line"
          :height="chartHeight"
          :width="isSmaller('md') ? Math.max(props.data.labels.length * 50, 600) : undefined"
          :options="chartOptions"
          :series="series"
          class="w-full"
        />
      </div>
    </div>
    <ui-empty-state v-else />
  </client-only>
</template>
