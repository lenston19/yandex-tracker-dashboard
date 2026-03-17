<script setup lang="ts">
import { addDays, startOfWeek, subDays } from 'date-fns'
import { onClickOutside } from '@vueuse/core'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import HeatmapLegend from './heatmap-legend.vue'
import { useIsMobile } from '~/core/composables/use-is-mobile'

const props = defineProps<{
  weekCount: number
  dayMap: Map<string, number>
  formatTooltip: (key: string) => string
  loading?: boolean
}>()

const DAYS_IN_WEEK = 7
const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

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

const cells = computed(() => {
  const todayKey = formatDayKey(today)
  return weeks.value.flatMap(week =>
    week.map(day => ({
      key: day.key,
      hours: day.key > todayKey ? null : (props.dayMap.get(day.key) ?? 0),
      weekKey: week[0]!.key
    }))
  )
})

const monthLabels = computed(() => {
  let lastLabel = ''
  return weeks.value.map(week => {
    const label = formatMonthShort(week[0]!.date)
    const show = label !== lastLabel
    lastLabel = label
    return { key: week[0]!.key, label: show ? label : '' }
  })
})

const mode = useColorMode()
const dark = computed(() => mode.value === 'dark')

const colorRanges = computed(() => [
  { from: 0, to: 0, color: dark.value ? 'var(--color-gray-700)' : 'var(--color-gray-100)', label: 'Нет активности' },
  { from: 0.001, to: 2, color: dark.value ? 'var(--color-green-900)' : 'var(--color-green-200)', label: 'до 2 ч' },
  { from: 2, to: 5, color: dark.value ? 'var(--color-green-700)' : 'var(--color-green-400)', label: '2–5 ч' },
  { from: 5, to: 8, color: dark.value ? 'var(--color-green-500)' : 'var(--color-green-600)', label: '5–8 ч' },
  { from: 8, to: 1000, color: dark.value ? 'var(--color-green-300)' : 'var(--color-green-800)', label: '8+ ч' }
])

function getColor(hours: number | null): string {
  if (hours === null) return colorRanges.value[0]!.color
  for (let i = colorRanges.value.length - 1; i >= 0; i--) {
    if (hours >= colorRanges.value[i]!.from) return colorRanges.value[i]!.color
  }
  return colorRanges.value[0]!.color
}

const openKey = ref<string | null>(null)
const gridRef = useTemplateRef('gridRef')

const isMobile = useIsMobile()

onClickOutside(gridRef, () => {
  openKey.value = null
})

function handleCellClick(key: string) {
  if (isMobile) {
    openKey.value = openKey.value === key ? null : key
  }
}

function tooltipOpen(key: string): boolean | undefined {
  if (isMobile) {
    return openKey.value === key
  }

  return
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex gap-1.5">
      <div class="grid shrink-0 grid-rows-[repeat(7,_1rem)] gap-[3px] lg:grid-rows-[repeat(7,_0.75rem)]">
        <span
          v-for="label in WEEKDAY_LABELS"
          :key="label"
          class="flex items-center text-[10px] leading-none text-muted"
        >
          {{ label }}
        </span>
      </div>

      <div class="min-w-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          ref="gridRef"
          class="grid auto-cols-[1rem] grid-flow-col grid-rows-[repeat(7,_1rem)] gap-[3px] lg:auto-cols-[0.75rem] lg:grid-rows-[repeat(7,_0.75rem)]"
        >
          <template v-if="loading">
            <u-skeleton
              v-for="i in weekCount * DAYS_IN_WEEK"
              :key="i"
              class="size-4 rounded-[2px] lg:size-3"
            />
          </template>
          <template v-else>
            <u-tooltip
              v-for="cell in cells"
              :key="cell.key"
              :open="tooltipOpen(cell.key)"
              :text="cell.hours !== null ? formatTooltip(cell.key) : ''"
              :delay-duration="0"
            >
              <div
                class="size-4 rounded-[2px] lg:size-3"
                :class="[{ 'cursor-pointer': cell.hours !== null && cell.hours > 0 }]"
                :style="cell.hours !== null ? { backgroundColor: getColor(cell.hours) } : {}"
                @click="handleCellClick(cell.key)"
              />
            </u-tooltip>
          </template>
        </div>

        <div class="mt-1 flex gap-[3px]">
          <div
            v-for="ml in monthLabels"
            :key="ml.key"
            class="w-4 shrink-0 overflow-visible text-[10px] leading-none whitespace-nowrap text-muted lg:w-3"
          >
            {{ ml.label }}
          </div>
        </div>
      </div>
    </div>
    <heatmap-legend :color-ranges="colorRanges" />
  </div>
</template>
