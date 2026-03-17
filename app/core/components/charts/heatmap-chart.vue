<script setup lang="ts">
import { subDays, addDays, startOfWeek } from 'date-fns'
import VueApexCharts from 'vue3-apexcharts'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useIsMobile } from '~/core/composables/use-is-mobile'

const props = defineProps<{
  weekCount: number
  dayMap: Map<string, number>
  formatTooltip: (key: string) => string
  loading: boolean
}>()

const isMobile = useIsMobile()

const DAYS_IN_WEEK = 7

const WEEKDAYS = [
  { name: 'Вс', index: 6 },
  { name: 'Сб', index: 5 },
  { name: 'Пт', index: 4 },
  { name: 'Чт', index: 3 },
  { name: 'Ср', index: 2 },
  { name: 'Вт', index: 1 },
  { name: 'Пн', index: 0 }
]

const today = new Date()

const { formatDayKey, formatMonthShort } = useDateFormatter()

const startDate = computed(() => {
  const d = startOfWeek(subDays(today, (props.weekCount - 1) * 7), { weekStartsOn: 1 })
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0)
})

const weeks = computed(() => {
  const result: { date: Date; key: string }[][] = []
  let cursor = startDate.value
  for (let w = 0; w < props.weekCount; w++) {
    const week: { date: Date; key: string }[] = []
    for (let d = 0; d < DAYS_IN_WEEK; d++) {
      week.push({ date: cursor, key: formatDayKey(cursor) })
      cursor = addDays(cursor, 1)
    }
    result.push(week)
  }
  return result
})

const weekLabelMap = computed(() => {
  const map = new Map<string, string>()
  let lastLabel = ''
  for (const week of weeks.value) {
    const firstDay = week[0]!
    const label = formatMonthShort(firstDay.date)
    if (label !== lastLabel) {
      map.set(firstDay.key, label)
      lastLabel = label
    }
  }
  return map
})

const series = computed(() => {
  const todayKey = formatDayKey(today)
  return WEEKDAYS.map(({ name, index: dayIndex }) => ({
    name,
    data: weeks.value.map(week => ({
      x: week[0]!.key,
      y: week[dayIndex]!.key > todayKey ? null : (props.dayMap.get(week[dayIndex]!.key) ?? 0)
    }))
  }))
})

const mode = useColorMode()
const dark = computed(() => mode.value === 'dark')

const colorRanges = computed(() => [
  { from: 0, to: 0, color: dark.value ? 'var(--color-gray-800)' : 'var(--color-gray-100)' },
  { from: 0.001, to: 2, color: dark.value ? 'var(--color-green-900)' : 'var(--color-green-200)' },
  { from: 2, to: 5, color: dark.value ? 'var(--color-green-700)' : 'var(--color-green-400)' },
  { from: 5, to: 8, color: dark.value ? 'var(--color-green-500)' : 'var(--color-green-600)' },
  { from: 8, to: 1000, color: dark.value ? 'var(--color-green-300)' : 'var(--color-green-800)' }
])

const axisLabelColor = computed(() => (dark.value ? 'var(--color-gray-500)' : 'var(--color-gray-400)'))
const strokeColor = computed(() => (dark.value ? 'var(--color-gray-900)' : 'var(--color-white)'))

const chartOptions = computed(() => ({
  chart: {
    type: 'heatmap',
    background: 'transparent',
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 2, colors: [strokeColor.value] },
  plotOptions: {
    heatmap: {
      enableShades: false,
      radius: 3,
      colorScale: { ranges: colorRanges.value }
    }
  },
  xaxis: {
    type: 'category',
    axisTicks: { show: false },
    axisBorder: { show: false },
    labels: {
      rotate: 0,
      style: { fontSize: '12px', colors: axisLabelColor.value },
      formatter: (val: string) => weekLabelMap.value.get(val) ?? ''
    },
    tooltip: false
  },
  yaxis: {
    labels: {
      style: { fontSize: '13px', colors: axisLabelColor.value }
    }
  },
  tooltip: {
    custom: ({ seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number }) => {
      const week = weeks.value[dataPointIndex]
      const day = week?.[WEEKDAYS[seriesIndex]!.index]
      if (!day || day.key > formatDayKey(today)) return '<div></div>'
      return `<div style="padding:6px 10px;font-size:12px">${props.formatTooltip(day.key)}</div>`
    }
  },
  theme: { mode: mode.value }
}))

const chartHeight = computed(() => (isMobile ? 350 : 300))

const mobileWidth = computed(() => props.weekCount * 50)
</script>

<template>
  <div class="flex flex-col gap-2">
    <client-only>
      <u-skeleton
        v-if="loading"
        class="w-full"
        :style="{ height: chartHeight + 'px' }"
      />
      <div
        v-else
        class="w-full overflow-y-hidden max-md:overflow-x-auto"
      >
        <div
          class="overflow-hidden md:w-full"
          :class="{ 'inline-block': isMobile }"
          :style="isMobile ? { minWidth: mobileWidth + 'px' } : {}"
        >
          <vue-apex-charts
            type="heatmap"
            :height="chartHeight"
            :width="isMobile ? mobileWidth : undefined"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>
    </client-only>
    <div class="flex items-center gap-1 px-4 text-xs text-muted">
      <span>меньше</span>
      <div
        v-for="range in colorRanges"
        :key="range.color"
        class="size-4 rounded-[3px]"
        :style="{ backgroundColor: range.color }"
      />
      <span>больше</span>
    </div>
  </div>
</template>
