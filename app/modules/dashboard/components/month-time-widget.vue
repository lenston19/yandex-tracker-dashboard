<script setup lang="ts">
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useSiteSettingsStore } from '~/modules/settings'
import { formatRUB } from '~/core/utils/format-money'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import DayLinearProgress from './ui/day-linear-progress.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const worklogsStore = useWorklogsStore('month', 'month-time-widget')

const { totalHours, isLoading } = storeToRefs(worklogsStore)
const { needHoursInCurrentMonth, gold } = storeToRefs(useSiteSettingsStore())

const currentRuble = computed(() => totalHours.value * gold.value)
const maxRuble = computed(() =>
  needHoursInCurrentMonth.value ? needHoursInCurrentMonth.value * gold.value : currentRuble.value
)

onMounted(async () => {
  if (!totalHours.value) {
    await worklogsStore.refresh()
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
