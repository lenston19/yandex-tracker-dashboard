<script setup lang="ts">
import { PASTEL_COLORS } from '../../constants/pastel-colors'
import type { PieChartData } from '../../types'
import UiEmptyState from '../ui/ui-empty-state.vue'
import VueApexCharts from 'vue3-apexcharts'
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'

const props = defineProps<{
  data: PieChartData
  loading: boolean
}>()

const hasData = computed(() => props.data.datasets.at(0)?.data.length)
const series = computed(() => props.data.datasets[0]?.data ?? [])
const labels = computed(() => props.data.labels ?? [])

const mode = useColorMode()

const total = computed(() => series.value.reduce((a, b) => a + b, 0))

const chartOptions = computed<ApexOptions>(() => ({
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
    fontSize: '12px',
    itemMargin: { horizontal: 6, vertical: 2 },
    formatter: function (label: string, opts: any) {
      const value = series.value[opts.seriesIndex] ?? 0
      const percent = total.value ? Math.round((value / total.value) * 100) : 0
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
    dropShadow: { enabled: true },
    formatter: function (val: number) {
      return `${Math.round(val)}%`
    }
  },
  theme: {
    mode: mode.value === 'dark' ? 'dark' : 'light'
  }
}))
</script>

<template>
  <div class="w-full">
    <u-skeleton
      v-if="loading"
      class="h-60 w-full"
    />
    <vue-apex-charts
      v-else-if="hasData"
      type="donut"
      height="240"
      :options="chartOptions"
      :series="series"
    />
    <ui-empty-state v-else />
  </div>
</template>
