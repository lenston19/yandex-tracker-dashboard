<script setup lang="ts">
import { useMonthTimeWidgetStore } from '~/stores/use-month-time-widget-store'
import { useSiteSettingsStore } from '~/stores/use-site-settings-store'
import { formatRUB } from '~/helpers/utils/format-money'
import WorklogActions from '~/components/worklogs/WorklogActions.vue'
import DayLinearProgress from '~/components/widgets/ui/DayLinearProgress.vue'
import UiCard from '~/components/ui/UiCard.vue'

const monthTimeWidgetStore = useMonthTimeWidgetStore()

const { totalHours, isLoading } = storeToRefs(monthTimeWidgetStore)
const { needHoursInCurrentMonth, gold } = storeToRefs(useSiteSettingsStore())

const currentRuble = computed(() => totalHours.value * gold.value)
const maxRuble = computed(() =>
  needHoursInCurrentMonth.value ? needHoursInCurrentMonth.value * gold.value : currentRuble.value
)

onMounted(async () => {
  if (!totalHours.value) {
    await monthTimeWidgetStore.refresh()
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
      />
      <day-linear-progress
        v-else
        :hours="null"
      />

      <u-progress
        v-if="gold"
        :model-value="currentRuble"
        :min="0"
        :max="maxRuble"
        color="info"
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
    </div>

    <template #footer>
      <worklog-actions
        class="ml-auto w-fit"
        :refresh="monthTimeWidgetStore.refresh"
        :loading="isLoading"
        type="month"
      />
    </template>
  </ui-card>
</template>
