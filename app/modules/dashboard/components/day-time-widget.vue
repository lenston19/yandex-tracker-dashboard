<script setup lang="ts">
import { useDayTimeWidgetStore } from '../store/use-day-time-widget-store'
import { useSiteSettingsStore } from '~/modules/settings'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import WidgetHeroStat from '~/core/components/ui/widget-hero-stat.vue'
import WidgetProgressBar from '~/core/components/ui/widget-progress-bar.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useQuickWorklog } from '~/core/composables/use-quick-worklog'
import { HEROICONS } from '~/core/constants/heroicons'
import { isWorkingDay } from '~/core/composables/use-production-calendar'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import { getHoursProgressColor } from '~/core/utils/progress-color'

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, isLoading } = storeToRefs(dayTimeWidgetStore)
const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const { formatFullDate } = useDateFormatter()
const { openQuickWorklog } = useQuickWorklog()

const isTodayWorkingDay = ref(true)
watchEffect(async () => {
  isTodayWorkingDay.value = await isWorkingDay(new Date())
})

const remainingToday = computed(() => {
  if (isLoading.value || totalHours.value == null) return null
  return +(hoursInDay.value - totalHours.value).toFixed(1)
})

const progressColor = computed(() => getHoursProgressColor(totalHours.value ?? 0, hoursInDay.value))

onMounted(async () => {
  if (!totalHours.value) {
    await dayTimeWidgetStore.refresh()
  }
})
</script>

<template>
  <ui-card
    :title="formatFullDate(new Date())"
    :subtitle="isTodayWorkingDay ? undefined : 'выходной'"
  >
    <div class="space-y-2">
      <widget-hero-stat
        :value="totalHours ?? 0"
        :max="hoursInDay"
        :loading="isLoading"
      />

      <widget-progress-bar
        :value="totalHours ?? null"
        :max="hoursInDay"
        :loading="isLoading"
        :color="progressColor"
      />

      <div
        v-if="remainingToday !== null"
        class="flex items-center gap-1.5 text-sm"
        :class="remainingToday <= 0 ? 'text-success' : 'text-muted'"
      >
        <u-icon
          v-if="remainingToday <= 0"
          :name="HEROICONS.CHECK_CIRCLE"
          class="size-4"
        />
        <span v-if="remainingToday <= 0">Норма дня выполнена</span>
        <span v-else>Ещё {{ pluralize(remainingToday, HOURS_PLURALIZE) }} до нормы</span>
      </div>
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <u-tooltip
          text="Добавить запись"
          :delay-duration="0"
        >
          <u-button
            :icon="HEROICONS.PLUS_CIRCLE"
            variant="ghost"
            size="md"
            square
            @click="openQuickWorklog()"
          />
        </u-tooltip>
        <worklog-actions
          class="ml-auto w-fit"
          :refresh="dayTimeWidgetStore.refresh"
          :loading="isLoading"
          type="day"
        />
      </div>
    </template>
  </ui-card>
</template>
