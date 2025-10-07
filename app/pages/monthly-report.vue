<script setup lang="ts">
import { DateTime } from 'luxon'
import LineChart from '~/components/charts/LineChart.vue'
import DonutChart from '~/components/charts/DonutChart.vue'
import { useMonthlyReportStore } from '~/stores/use-monthly-report-store'
import { pluralize } from '~/helpers/utils/pluralize'
import { hoursPluralize } from '~/constants/pluralize-array-words'
import UiPageHeader from '~/components/ui/UiPageHeader.vue'
import UiCard from '~/components/ui/UiCard.vue'

useHead({ title: 'Месячный отчет' })

definePageMeta({ middleware: ['auth'] })

const monthlyReportStore = useMonthlyReportStore()
const { monthLineChartData, monthPieChartData, params, isLoading, averageHoursByMonth, totalHours } =
  storeToRefs(monthlyReportStore)

const title = computed(() => DateTime.fromISO(params.value.from).toFormat('LLLL yyyy'))

type BadgeColor = 'error' | 'secondary' | 'warning' | 'primary' | 'success' | 'info' | 'neutral'

const columns = [
  {
    accessorKey: 'name',
    header: 'Наименование'
  },
  {
    accessorKey: 'value',
    header: 'Значение'
  }
]

const averageBadgeColor = computed(() => {
  switch (true) {
    case averageHoursByMonth.value < 5:
      return 'error'
    case averageHoursByMonth.value < 8:
      return 'warning'
    default:
      return 'primary'
  }
})

const data = computed(() => {
  return [
    {
      name: 'Часов за месяц',
      value: pluralize(totalHours.value, hoursPluralize),
      attrs: {
        color: 'secondary' as BadgeColor
      }
    },
    {
      name: 'Среднее значение часов за месяц',
      value: pluralize(averageHoursByMonth.value, hoursPluralize),
      helpText:
        'Часы за все\u00A0дни / количество\u00A0дней <br><span class="text-xs text-gray-300">*\u00A0минимум\u00A015\u00A0минут в день</span>',
      attrs: {
        color: averageBadgeColor.value as BadgeColor
      }
    }
  ]
})

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
    <div class="grid grid-cols-2 gap-4">
      <ui-card
        title="Динамика рабочего времени по дням"
        class="col-span-2"
      >
        <line-chart
          :loading="isLoading"
          :data="monthLineChartData"
        />
      </ui-card>
      <ui-card
        title="Статистика"
        class="col-span-2 lg:col-span-1"
      >
        <div class="flex justify-center">
          <u-table
            v-if="!isLoading"
            :data="data"
            :columns="columns"
            class="w-full"
          >
            <template #name-cell="{ row }">
              <div class="flex items-center gap-2 text-wrap">
                {{ row.original.name }}
                <u-tooltip
                  v-if="row.original.helpText?.length"
                  :delay-duration="0"
                  :text="row.original.helpText"
                  base-class="max-w-[226px]"
                />
              </div>
            </template>
            <template #value-cell="{ row }">
              <u-badge
                :label="row.original.value"
                v-bind="row.original.attrs"
              />
            </template>
          </u-table>
          <u-skeleton
            v-else
            class="mt-5 h-48 w-[calc(100%-3rem)]"
          />
        </div>
      </ui-card>
      <ui-card
        title="Занятость на проектах"
        class="col-span-2 lg:col-span-1"
      >
        <donut-chart
          :loading="isLoading"
          :data="monthPieChartData"
        />
      </ui-card>
    </div>
  </div>
</template>
