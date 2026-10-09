<script setup lang="ts">
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import { useSiteSettingsStore } from '~/modules/settings'
import { useWeekTimeWidgetStore } from '../store/use-week-time-widget-store'
import WidgetProgressBar from '~/core/components/ui/widget-progress-bar.vue'
import WidgetHeroStat from '~/core/components/ui/widget-hero-stat.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiMeterGroup from '~/core/components/ui/ui-meter-group.vue'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { parseDateOnly } from '~/core/utils/time'
import { getHoursProgressColor } from '~/core/utils/progress-color'

const weekTimeWidgetStore = useWeekTimeWidgetStore()
const { currentWeek, params, weekTotalHours, isLoading, flatQueueWorklogs, isLoadingQueue } =
  storeToRefs(weekTimeWidgetStore)

const { hoursInDay, isShowWeeklyLoading } = storeToRefs(useSiteSettingsStore())

const { formatShortDate } = useDateFormatter()
const weekRange = computed(() => {
  const from = parseDateOnly(params.value.from)
  const to = parseDateOnly(params.value.to)
  return `${formatShortDate(from)} - ${formatShortDate(to)}`
})

const workingDaysCount = computed(() => {
  if (!currentWeek.value.length) return 5
  return currentWeek.value.filter(day => !day.isHoliday).length
})

const maxHoursInWeek = computed(() =>
  hoursInDay.value ? hoursInDay.value * workingDaysCount.value : workingDaysCount.value * 8
)

const dayProgressColor = (day: { hours: number; isHoliday: boolean }) =>
  getHoursProgressColor(day.hours, hoursInDay.value || 8, day.isHoliday)

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
    title="Неделя"
    :subtitle="weekRange"
    :ui="{ footer: 'w-full' }"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <template v-if="isLoading">
        <div
          v-for="day in 7"
          :key="`day-${day}`"
          class="space-y-1.5 p-1.5"
        >
          <u-skeleton class="h-5 w-16" />
          <widget-progress-bar
            :value="null"
            :max="1"
            loading
          />
          <u-skeleton class="h-5 w-10" />
        </div>
      </template>
      <template v-else>
        <div
          v-for="day in currentWeek"
          :key="day.dateKey"
          class="flex flex-col gap-1.5 p-1.5 transition-colors"
          :class="{
            'cursor-pointer hover:bg-accented': day.hours > 0,
            'border-primary max-sm:-mt-2 max-sm:border-t-2 max-sm:pt-2 sm:-ml-2 sm:border-l-2 sm:pl-2': day.isNewMonth
          }"
          @click="weekTimeWidgetStore.openDetailDay(day)"
        >
          <div class="flex items-baseline justify-between gap-1.5">
            <span
              class="flex items-center gap-1 text-sm font-bold capitalize"
              :class="{ 'text-primary': day.isToday }"
            >
              <span
                v-if="day.isToday"
                class="inline-block size-1.5 rounded-full bg-primary"
              />
              {{ day.weekday }}
            </span>
            <span class="text-xs text-muted">{{ day.shortDate }}</span>
          </div>

          <widget-progress-bar
            :value="day.hours"
            :max="hoursInDay || 8"
            :color="dayProgressColor(day)"
          />
          <div class="flex items-center gap-1 text-sm text-muted">
            <span>{{ pluralize(day.hours, HOURS_PLURALIZE) }}</span>
            <span v-if="day.isHoliday">· выходной</span>
          </div>
        </div>
      </template>
    </div>

    <ui-meter-group
      v-if="flatQueueWorklogs.length && isShowWeeklyLoading && !isLoadingQueue && !isLoading"
      :min="0"
      :max="100"
      :items="meterGroupItems"
      class="mt-5"
    />

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <widget-hero-stat
          :value="+weekTotalHours.toFixed(2)"
          :max="maxHoursInWeek"
          :loading="isLoading"
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
