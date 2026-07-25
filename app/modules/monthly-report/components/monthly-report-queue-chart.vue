<script setup lang="ts">
import DonutChart from '~/core/components/charts/donut-chart.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'

const { monthPieChartData, isLoading } = storeToRefs(useMonthlyReportStore())
</script>

<template>
  <ui-card title="Занятость на проектах">
    <donut-chart
      :loading="isLoading"
      :data="monthPieChartData"
    />
  </ui-card>
</template>
