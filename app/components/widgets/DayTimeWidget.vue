<script setup lang="ts">
import { DateTime } from 'luxon'
import { useDayTimeWidgetStore } from '~/stores/use-day-time-widget-store'
import { useSiteSettingsStore } from '~/stores/use-site-settings-store'
import WorklogActions from '~/components/worklogs/WorklogActions.vue'
import DayLinearProgress from '~/components/widgets/ui/DayLinearProgress.vue'
import UiCard from '~/components/ui/UiCard.vue'

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
