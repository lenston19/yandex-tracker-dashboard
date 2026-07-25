<script setup lang="ts">
import LineChart from '~/core/components/charts/line-chart.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'

const { monthLineChartData, isLoading } = storeToRefs(useMonthlyReportStore())
</script>

<template>
  <ui-card
    title="Динамика рабочего времени по дням"
    fill
  >
    <line-chart
      :loading="isLoading"
      :data="monthLineChartData"
      fill
    />
  </ui-card>
</template>
