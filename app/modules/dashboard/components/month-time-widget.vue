<script setup lang="ts">
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useSiteSettingsStore } from '~/modules/settings'
import { formatRUB } from '~/core/utils/format-money'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import DayLinearProgress from './ui/day-linear-progress.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'
import { isWorkingDay } from '~/core/composables/use-production-calendar'
import { useDayTimeWidgetStore } from '../store/use-day-time-widget-store'
import { pluralize } from '~/core/utils/pluralize'

const worklogsStore = useWorklogsStore('month', 'month-time-widget')
const dayTimeWidgetStore = useDayTimeWidgetStore()

useWorklogBus('saved', worklogsStore.addWorklog)
useWorklogBus('deleted', worklogsStore.removeWorklog)

const { totalHours, isLoading } = storeToRefs(worklogsStore)
const { totalHours: todayHours } = storeToRefs(dayTimeWidgetStore)
const { needHoursInCurrentMonth, remainingWorkdays, hoursInDay, gold } = storeToRefs(useSiteSettingsStore())

const isTodayWorkingDay = ref(false)
watchEffect(async () => {
  isTodayWorkingDay.value = await isWorkingDay(new Date())
})

const currentRuble = computed(() => totalHours.value * gold.value)
const maxRuble = computed(() =>
  needHoursInCurrentMonth.value ? needHoursInCurrentMonth.value * gold.value : currentRuble.value
)

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
    <div class="space-y-3">
      <day-linear-progress
        v-if="!isLoading"
        :hours="totalHours"
        :max="needHoursInCurrentMonth"
        show-max
      >
        <template #help-text>
          <u-tooltip
            v-if="!isLoading && hoursPerDayNeeded"
            :delay-duration="0"
            :text="`Чтобы выполнить план, нужно отрабатывать по ${hoursPerDayNeeded} ч в день. Осталось ${remainingWorkdaysText} раб.`"
          >
            <div
              class="cursor-help text-right text-sm text-muted italic underline decoration-dashed underline-offset-2"
            >
              нужно {{ hoursPerDayNeeded }} ч/день
            </div>
          </u-tooltip>
        </template>
      </day-linear-progress>
      <day-linear-progress
        v-else
        :hours="null"
      />

      <template v-if="gold">
        <u-progress
          :model-value="currentRuble"
          :min="0"
          :max="maxRuble"
          animation="swing"
        />
        <div
          v-if="!isLoading"
          class="text-right text-sm italic"
        >
          {{ formatRUB(currentRuble) }} / {{ formatRUB(maxRuble) }}
        </div>
        <u-skeleton
          v-else
          class="ml-auto h-6 w-[100px]"
        />
      </template>
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
