<script setup lang="ts">
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useSiteSettingsStore } from '~/modules/settings'
import { formatRUB } from '~/core/utils/format-money'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import WidgetHeroStat from '~/core/components/ui/widget-hero-stat.vue'
import WidgetProgressBar from '~/core/components/ui/widget-progress-bar.vue'
import WidgetHelpIcon from '~/core/components/ui/widget-help-icon.vue'
import ThemeCelebration from '~/core/components/theme/theme-celebration.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'
import { isWorkingDay } from '~/core/composables/use-production-calendar'
import { useDayTimeWidgetStore } from '../store/use-day-time-widget-store'
import { pluralize } from '~/core/utils/pluralize'
import { calcForecastHours } from '~/core/utils/forecast'
import { useDateFormatter } from '~/core/composables/use-date-formatter'

const worklogsStore = useWorklogsStore('month', 'month-time-widget')
const dayTimeWidgetStore = useDayTimeWidgetStore()

useWorklogBus('saved', worklogsStore.addWorklog)
useWorklogBus('deleted', worklogsStore.removeWorklog)

const { totalHours, isLoading, worklogsModel } = storeToRefs(worklogsStore)
const { totalHours: todayHours } = storeToRefs(dayTimeWidgetStore)
const { needHoursInCurrentMonth, remainingWorkdays, hoursInDay, gold, seasonalTheme } =
  storeToRefs(useSiteSettingsStore())
const { formatDayKey } = useDateFormatter()

const isTodayWorkingDay = ref(false)
watchEffect(async () => {
  isTodayWorkingDay.value = await isWorkingDay(new Date())
})

const currentRuble = computed(() => totalHours.value * gold.value)

const effectiveRemainingWorkdays = computed(() => {
  const dailyTarget = hoursInDay.value || 8
  const isTodayFinished = isTodayWorkingDay.value && (todayHours.value ?? 0) >= dailyTarget
  return isTodayFinished ? Math.max(remainingWorkdays.value - 1, 0) : remainingWorkdays.value
})

const remainingWorkdaysText = computed(() => pluralize(effectiveRemainingWorkdays.value, ['день', 'дня', 'дней']))

const hoursPerDayNeeded = computed(() => {
  const remaining = needHoursInCurrentMonth.value - totalHours.value
  if (remaining <= 0 || !effectiveRemainingWorkdays.value) return null
  return +(remaining / effectiveRemainingWorkdays.value).toFixed(1)
})

const workedDaysSoFar = computed(() => new Set(worklogsModel.value.map(w => formatDayKey(w.start))).size)

const forecastHours = computed(() =>
  calcForecastHours(totalHours.value, workedDaysSoFar.value, effectiveRemainingWorkdays.value)
)

const isForecastOnTrack = computed(
  () => forecastHours.value !== null && forecastHours.value >= needHoursInCurrentMonth.value
)

const celebrationGlyph = computed(() => (seasonalTheme.value.type === 'halloween' ? '🎃' : '❄️'))

const forecastTooltip = computed(() => {
  const base = `Прогноз — сколько часов вы отработаете к концу месяца при текущем темпе. Норма месяца — ${needHoursInCurrentMonth.value} ч.`
  if (!hoursPerDayNeeded.value) return base
  return `${base} Чтобы выполнить норму, нужно отрабатывать по ${hoursPerDayNeeded.value} ч в день. Осталось ${remainingWorkdaysText.value} раб.`
})

onMounted(async () => {
  if (!totalHours.value) {
    await worklogsStore.refresh()
  }
  if (todayHours.value === undefined) {
    await dayTimeWidgetStore.refresh()
  }
})
</script>

<template>
  <ui-card title="Сводка месяца">
    <div class="relative space-y-2">
      <theme-celebration
        v-if="seasonalTheme.active"
        :trigger="isForecastOnTrack"
        :glyph="celebrationGlyph"
      />

      <widget-hero-stat
        :value="totalHours"
        :max="needHoursInCurrentMonth"
        :loading="isLoading"
      />

      <widget-progress-bar
        :value="totalHours"
        :max="needHoursInCurrentMonth"
        :loading="isLoading"
      />

      <div
        v-if="!isLoading && forecastHours !== null"
        class="flex items-center gap-1.5 text-sm"
        :class="isForecastOnTrack ? 'text-success' : 'text-error'"
      >
        <span>Прогноз: ~{{ forecastHours }} ч</span>
        <widget-help-icon :text="forecastTooltip" />
      </div>

      <div
        v-if="!isLoading && gold"
        class="flex items-center gap-1.5 text-sm"
      >
        <u-icon
          :name="HEROICONS.BANKNOTES"
          class="size-4 text-muted"
        />
        <span class="text-muted">Заработано:</span>
        <span class="font-semibold text-highlighted">{{ formatRUB(currentRuble) }}</span>
      </div>
    </div>

    <template #footer>
      <worklog-actions
        class="ml-auto w-fit"
        :refresh="worklogsStore.refresh"
        :loading="isLoading"
        type="month"
      />
    </template>
  </ui-card>
</template>
