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
  <ui-card>
    <template #header>
      <div class="flex items-center justify-between">
        <div
          v-if="title"
          class="text-lg font-bold"
        >
          {{ title }}
        </div>
        <div v-if="showTotal">
          Всего:
          <span class="font-bold">
            {{ calcByProject(rows) }}
          </span>
        </div>
      </div>
    </template>
    <u-table
      v-model:expanded="expanded"
      :data="data"
      :columns="GROUPED_WORKLOG_COLUMNS"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
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
        <worklogs-table :worklogs="row.original.items" />
      </template>
    </u-table>
    <template #footer>
      <ui-pagination
        v-model="page"
        :total="rows.length"
        :page-count="pageCount"
      />
    </template>
  </ui-card>
</template>
