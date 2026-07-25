<script setup lang="ts">
import BarChart from '~/core/components/charts/bar-chart.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'

const { weekdayChartData, isLoading } = storeToRefs(useMonthlyReportStore())
</script>

<template>
  <ui-card
    title="Активность по дням недели"
    fill
  >
    <bar-chart
      :loading="isLoading"
      :data="weekdayChartData"
      fill
    />
  </ui-card>
</template>
