<script setup lang="ts">
import type { PieChartData } from '../../types'
import UiEmptyState from '../ui/ui-empty-state.vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps<{
  data: PieChartData
  loading: boolean
}>()

const hasData = computed(() => props.data.datasets.at(0)?.data.length)
const series = computed(() => props.data.datasets[0]?.data ?? [])
const labels = computed(() => props.data.labels ?? [])

const mode = useColorMode()

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
  labels: labels.value,
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
    <!-- :key="JSON.stringify(data)" -->
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
