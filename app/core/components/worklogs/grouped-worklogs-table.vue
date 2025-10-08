<script setup lang="ts">
import { calculateTotalHours, formatHoursToHHMMSS } from '../../utils/time'
import WorklogsTable from './worklogs-table.vue'
import type { CollectedWorklog } from '../../types/worklogs'
import UiPagination from '../ui/ui-pagination.vue'
import UiCard from '../ui/ui-card.vue'
import { GROUPED_WORKLOG_COLUMNS } from '~/core/constants/worklogs'

const props = withDefaults(
  defineProps<{
    rows: CollectedWorklog[]
    title?: string
    showTotal?: boolean
    pageCount?: number
  }>(),
  {
    showTotal: false,
    pageCount: 5
  }
)

const expanded = ref()

const getTotalTime = (row: CollectedWorklog) => formatHoursToHHMMSS(calculateTotalHours(row.items))

const page = ref(1)

const data = computed(() => {
  return props.rows.slice((page.value - 1) * props.pageCount, page.value * props.pageCount)
})

const calcByProject = (rows: CollectedWorklog[]) => {
  if (!props.showTotal) return
  const total = rows.reduce((acc, item) => acc + calculateTotalHours(item.items), 0)
  return formatHoursToHHMMSS(total)
}
</script>

<template>
  <ui-card
    :ui="{
      body: 'p-0 sm:p-0'
    }"
  >
    <template
      v-if="title || showTotal"
      #header
    >
      <div class="flex items-center justify-between">
        <div
          v-if="title"
          class="text-lg font-bold"
        >
          {{ title }}
        </div>
        <div
          v-if="showTotal"
          class="flex items-center gap-1"
        >
          <div class="text-base font-medium italic">Всего:</div>
          <u-badge
            class="font-bold"
            color="neutral"
            variant="subtle"
            size="lg"
          >
            {{ calcByProject(rows) }}
          </u-badge>
        </div>
      </div>
    </template>
    <u-table
      v-model:expanded="expanded"
      :data="data"
      :columns="GROUPED_WORKLOG_COLUMNS"
    >
      <template #expand-cell="{ row }">
        <u-button
          color="neutral"
          variant="ghost"
          icon="i-lucide-chevron-down"
          square
          aria-label="Expand"
          :ui="{
            leadingIcon: ['transition-transform', row.getIsExpanded() ? 'duration-200 rotate-180' : '']
          }"
          @click="row.toggleExpanded()"
        />
      </template>
      <template #totalTime-cell="{ row }">
        <u-badge
          :label="getTotalTime(row.original)"
          color="secondary"
          variant="subtle"
        />
      </template>

      <template #expanded="{ row }">
        <div class="w-full overflow-x-auto">
          <div class="min-w-max">
            <worklogs-table :worklogs="row.original.items" />
          </div>
        </div>
      </template>
    </u-table>
    <template
      v-if="rows.length > pageCount"
      #footer
    >
      <ui-pagination
        v-model="page"
        :total="rows.length"
        :page-count="pageCount"
      />
    </template>
  </ui-card>
</template>
