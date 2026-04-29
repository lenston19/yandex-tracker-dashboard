<script setup lang="ts">
import { parseISO } from 'date-fns'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import { useSiteSettingsStore } from '~/modules/settings'
import { useWeekTimeWidgetStore } from '../store/use-week-time-widget-store'
import DayLinearProgress from './ui/day-linear-progress.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiMeterGroup from '~/core/components/ui/ui-meter-group.vue'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import { useDateFormatter } from '~/core/composables/use-date-formatter'

const weekTimeWidgetStore = useWeekTimeWidgetStore()
const { currentWeek, params, weekTotalHours, isLoading, flatQueueWorklogs, isLoadingQueue } =
  storeToRefs(weekTimeWidgetStore)

const { hoursInDay, isShowWeeklyLoading } = storeToRefs(useSiteSettingsStore())

const { formatShortDate } = useDateFormatter()
const title = computed(() => {
  const from = parseISO(params.value.from.slice(0, 10) + 'T12:00:00')
  const to = parseISO(params.value.to.slice(0, 10) + 'T12:00:00')
  return `${formatShortDate(from)} - ${formatShortDate(to)}`
})

const workingDaysCount = computed(() => {
  if (!currentWeek.value.length) return 5
  return currentWeek.value.filter(day => !day.isHoliday).length
})

const maxHoursInWeek = computed(() =>
  pluralize(hoursInDay.value ? hoursInDay.value * workingDaysCount.value : workingDaysCount.value * 8, HOURS_PLURALIZE)
)

const currentHoursInWeek = computed(() => pluralize(+weekTotalHours.value.toFixed(2), HOURS_PLURALIZE))

const meterGroupItems = computed(() =>
  flatQueueWorklogs.value.map(queue => ({
    value: queue.percentage,
    color: queue.color,
    label: `${queue.queueName} (${pluralize(+queue.hours.toFixed(2), HOURS_PLURALIZE)})`
  }))
)

onMounted(async () => {
  if (!weekTotalHours.value) {
    await weekTimeWidgetStore.refresh()
  }
})
</script>

<template>
  <ui-card
    :ui="{
      footer: 'w-full'
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <div class="text-lg font-medium">Неделя</div>
        <u-badge
          variant="subtle"
          color="primary"
          size="lg"
        >
          {{ title }}
        </u-badge>
      </div>
    </template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
      <template v-if="isLoading">
        <day-linear-progress
          v-for="day in 7"
          :key="`day-${day}`"
          :hours="null"
        />
      </template>
      <template v-else>
        <div
          v-for="day in currentWeek"
          :key="`day-${day.weekday}-${day.hours}`"
          class="flex flex-col gap-0 p-1 transition-colors"
          :class="{
            'cursor-pointer hover:bg-elevated': day.hours > 0,
            'border-primary max-sm:-mt-2 max-sm:border-t-2 max-sm:pt-2 sm:-ml-2 sm:border-l-2 sm:pl-2': day.isNewMonth
          }"
          @click="weekTimeWidgetStore.openDetailDayDialog(day)"
        >
          <div class="flex items-baseline justify-between gap-1.5">
            <span class="text-sm font-bold capitalize">{{ day.weekday }}</span>
            <span class="text-xs text-muted">{{ day.shortDate }}</span>
          </div>
          <day-linear-progress
            :hours="day.hours"
            :max="hoursInDay"
            :is-holiday="day.isHoliday"
          />
        </div>
      </template>
    </div>
    <template v-if="flatQueueWorklogs.length && isShowWeeklyLoading && !isLoadingQueue && !isLoading">
      <u-separator class="py-4" />
      <ui-meter-group
        :min="0"
        :max="100"
        :items="meterGroupItems"
      />
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <div
          v-if="!isLoading"
          class="flex flex-wrap gap-1 text-lg"
        >
          Всего: <span class="text-md font-semibold italic">{{ currentHoursInWeek }} / {{ maxHoursInWeek }} </span>
        </div>
        <u-skeleton
          v-else
          class="h-6 w-[160px]"
        />
        <worklog-actions
          class="ml-auto"
          :loading="isLoading"
          :next="weekTimeWidgetStore.next"
          :prev="weekTimeWidgetStore.prev"
          :refresh="weekTimeWidgetStore.refresh"
          type="week"
        />
      </div>
    </template>
  </ui-card>
</template>
