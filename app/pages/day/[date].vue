<script setup lang="ts">
import { format as formatDate, startOfDay, endOfDay } from 'date-fns'
import { collectWorklogs } from '~/core/utils/collecting'
import { calculateTotalHours, formatHoursToFixed, LOCAL_UTC_ISO, parseDateOnly } from '~/core/utils/time'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useWorklogsFetch } from '~/core/composables/use-worklogs-fetch'
import { useAuthStore } from '~/core/store/use-auth-store'
import GroupedWorklogsTable from '~/core/components/worklogs/grouped-worklogs-table.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'

const route = useRoute()
const router = useRouter()
const { login } = storeToRefs(useAuthStore())
const { formatFullDate } = useDateFormatter()

const dateParam = computed(() => route.params.date as string)

const dateLabel = computed(() => {
  try {
    return formatFullDate(parseDateOnly(dateParam.value))
  } catch {
    return dateParam.value
  }
})

const from = computed(() => formatDate(startOfDay(parseDateOnly(dateParam.value)), LOCAL_UTC_ISO))
const to = computed(() => formatDate(endOfDay(parseDateOnly(dateParam.value)), LOCAL_UTC_ISO))

const {
  worklogsModel: worklogs,
  refresh: fetchWorklogs,
  isLoading,
  addWorklog,
  removeWorklog
} = useWorklogsFetch(from, to)

watch([login, dateParam], () => fetchWorklogs(), { immediate: true })

useWorklogBus('saved', addWorklog)
useWorklogBus('deleted', removeWorklog)

const tableRows = computed(() => collectWorklogs(worklogs.value).result)

const totalHoursLabel = computed(() =>
  pluralize(formatHoursToFixed(calculateTotalHours(worklogs.value)), HOURS_PLURALIZE)
)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-3">
      <u-button
        :icon="HEROICONS.ARROW_LEFT"
        variant="ghost"
        size="sm"
        @click="router.back()"
      />
      <h1 class="text-xl font-semibold">{{ dateLabel }}</h1>
      <u-badge
        v-if="!isLoading && worklogs.length"
        :label="`Итого: ${totalHoursLabel}`"
        color="primary"
        variant="subtle"
      />
      <u-button
        :icon="HEROICONS.ARROW_PATH"
        variant="ghost"
        size="sm"
        square
        :loading="isLoading"
        class="ml-auto"
        @click="fetchWorklogs()"
      />
    </div>

    <ui-card v-if="isLoading || !worklogs.length">
      <u-skeleton
        v-if="isLoading"
        class="h-48 w-full"
      />
      <ui-empty-state v-else />
    </ui-card>

    <grouped-worklogs-table
      v-else
      :rows="tableRows"
    />
  </div>
</template>
