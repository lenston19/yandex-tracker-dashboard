<script setup lang="ts">
import { useDayTimeWidgetStore } from '../store/use-day-time-widget-store'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import DayLinearProgress from './ui/day-linear-progress.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useNow } from '@vueuse/core'

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, isLoading } = storeToRefs(dayTimeWidgetStore)
const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const { formatShortDate } = useDateFormatter()
const now = useNow()

onMounted(async () => {
  if (!totalHours.value) {
    await dayTimeWidgetStore.refresh()
  }
})
</script>

<template>
  <ui-card>
    <template #header>
      <div class="flex items-center gap-2">
        <div class="text-lg font-medium">Сегодня</div>
        <u-badge
          variant="subtle"
          color="primary"
          size="lg"
        >
          {{ formatShortDate(now) }}
        </u-badge>
      </div>
    </template>
    <day-linear-progress
      :hours="!isLoading ? totalHours : null"
      :max="!isLoading ? hoursInDay : undefined"
      loading
    />

    <template #footer>
      <worklog-actions
        class="ml-auto w-fit"
        :refresh="dayTimeWidgetStore.refresh"
        :loading="isLoading"
        type="day"
      />
    </template>
  </ui-card>
</template>
