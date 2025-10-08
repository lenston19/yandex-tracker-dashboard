<script setup lang="ts">
import { PASTEL_COLORS } from '../../constants/pastel-colors'
import type { PieChartData } from '../../types'
import UiEmptyState from '../ui/ui-empty-state.vue'
import VueApexCharts from 'vue3-apexcharts'
import { computed } from 'vue'

const props = defineProps<{
  data: PieChartData
  loading: boolean
}>()

const hasData = computed(() => props.data.datasets.at(0)?.data.length)
const series = computed(() => props.data.datasets[0]?.data ?? [])
const labels = computed(() => props.data.labels ?? [])

const mode = useColorMode()

const total = computed(() => series.value.reduce((a, b) => a + b, 0))

const chartOptions = computed(() => ({
  plotOptions: {
    pie: {
      expandOnClick: false
    }
  },
  chart: {
    type: 'donut',
    zoom: { enabled: false },
    toolbar: { show: false },
    background: 'transparent'
  },
  colors: PASTEL_COLORS.slice(0, series.value.length),
  labels: labels.value,
  tooltip: { enabled: false },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    formatter: function (label: string, opts: any) {
      const value = series.value[opts.seriesIndex] ?? 0
      const percent = total.value ? ((value / total.value) * 100).toFixed(1) : '0'
      return `${label} (${percent}%)`
    }
  },
  states: {
    hover: {
      filter: {
        type: 'none'
      }
    },
    active: {
      filter: {
        type: 'none'
      }
    }
  },
  dataLabels: {
    enabled: true,
    dropShadow: { enabled: false },
    style: {
      colors: ['var(--ui-text-inverted)']
    },
    formatter: function (val: number) {
      return `${val.toFixed(1)}%`
    }
  },
  theme: {
    mode: mode.value
  }
}))
</script>

<template>
  <div class="w-full">
    <u-skeleton
      v-if="loading"
      class="h-48 w-full"
    />
    <vue-apex-charts
      v-else-if="hasData"
      type="donut"
      height="200"
      class="max-h-48"
      :options="chartOptions"
      :series="series"
    />
    <ui-empty-state v-else />
  </div>
</template>
