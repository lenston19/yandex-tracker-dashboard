<script setup lang="ts">
import { DateTime } from 'luxon'
import { useDayTimeWidgetStore } from '../store/use-day-time-widget-store'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import DayLinearProgress from './ui/day-linear-progress.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, isLoading } = storeToRefs(dayTimeWidgetStore)
const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const title = computed(() => `Сегодня - ${DateTime.now().toFormat('dd.MM.yyyy')}`)

onMounted(async () => {
  if (!totalHours.value) {
    await dayTimeWidgetStore.refresh()
  }
})
</script>

<template>
  <ui-card :title="title">
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
