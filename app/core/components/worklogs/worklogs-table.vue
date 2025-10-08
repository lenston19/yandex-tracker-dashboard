<script setup lang="ts">
import { DateTime } from 'luxon'
import { calculateWorklogTimeByDay } from '../../utils/time'
import type { Yandex } from '../../types/api/yandex-tracker/yandex-tracker.entity'
import UiPagination from '../ui/ui-pagination.vue'
import { WORKLOG_COLUMNS } from '../../constants/worklogs'
import UiCard from '../ui/ui-card.vue'

const props = defineProps<{
  worklogs: Yandex.Worklog[]
}>()

const getKey = (row: Yandex.Worklog) => row.issue.key
const getName = (row: Yandex.Worklog) => row.issue.display
const getTime = (row: Yandex.Worklog) => calculateWorklogTimeByDay(row)
const getDateCreatedAt = (row: Yandex.Worklog) => DateTime.fromISO(row.start).toFormat('dd.MM.yyyy')
const getTimeCreatedAt = (row: Yandex.Worklog) => DateTime.fromISO(row.start).toFormat('HH:mm:ss')

const page = ref<number>(1)
const pageCount = 5
const rows = computed(() => props.worklogs.slice((page.value - 1) * pageCount, page.value * pageCount))
</script>

<template>
  <ui-card
    :ui="{
      body: 'p-0 sm:p-0'
    }"
  >
    <u-table
      :data="rows"
      :columns="WORKLOG_COLUMNS"
      :ui="{
        thead: 'whitespace-nowrap w-fit',
        td: 'first:whitespace-pre-wrap last:whitespace-pre-wrap w-fit first:w-80 last:w-50',
        th: 'first:whitespace-pre-wrap last:whitespace-pre-wrap w-fit first:w-80 last:w-50'
      }"
    >
      <template #id-cell="{ row }">
        {{ getKey(row.original) }}
      </template>
      <template #name-cell="{ row }">
        {{ getName(row.original) }}
      </template>
      <template #time-cell="{ row }">
        <u-badge
          :label="getTime(row.original)"
          color="info"
          variant="subtle"
        />
      </template>
      <template #dateCreatedAt-cell="{ row }">
        {{ getDateCreatedAt(row.original) }}
      </template>
      <template #timeCreatedAt-cell="{ row }">
        {{ getTimeCreatedAt(row.original) }}
      </template>
    </u-table>

    <template
      v-if="rows.length > pageCount"
      #footer
    >
      <ui-pagination
        v-model="page"
        :total="rows.length"
      />
    </template>
  </ui-card>
</template>
