<script setup lang="ts">
import { parseISO } from 'date-fns'
import UiPageHeader from '~/core/components/ui/ui-page-header.vue'
import MonthlyReportTimeChart from '../components/monthly-report-time-chart.vue'
import MonthlyReportStatsTable from '../components/monthly-report-stats-table.vue'
import MonthlyReportQueueChart from '../components/monthly-report-queue-chart.vue'
import MonthlyReportWeekdayChart from '../components/monthly-report-weekday-chart.vue'
import MonthlyReportOverEstimationCard from '../components/monthly-report-over-estimation-card.vue'
import MonthlyReportTopIssuesCard from '../components/monthly-report-top-issues-card.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { useDateFormatter } from '~/core/composables/use-date-formatter'

useHead({ title: SITEMAP.monthlyReport.name })

const monthlyReportStore = useMonthlyReportStore()
const { monthLineChartData, monthPieChartData, params, isLoading } = storeToRefs(monthlyReportStore)

const { formatMonthYear } = useDateFormatter()
const title = computed(() => formatMonthYear(parseISO(params.value.from)))

onMounted(() => {
  if (!monthLineChartData.value.datasets.length || !monthPieChartData.value.datasets.length) {
    monthlyReportStore.refresh()
  }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <ui-page-header
      :title="title"
      :loading="isLoading"
      :next="monthlyReportStore.next"
      :prev="monthlyReportStore.prev"
      :refresh="monthlyReportStore.refresh"
    />
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <monthly-report-time-chart class="lg:col-span-2" />
      <monthly-report-stats-table class="lg:col-span-1" />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <monthly-report-queue-chart />
      <monthly-report-weekday-chart />
    </div>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <monthly-report-top-issues-card />
      <monthly-report-over-estimation-card />
    </div>
  </div>
</template>
