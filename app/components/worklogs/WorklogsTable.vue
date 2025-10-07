<script setup lang="ts">
import { DateTime } from 'luxon'
import { calculateWorklogTimeByDay } from '~/helpers/utils/time'
import type { Yandex } from '~/types/api/yandex-tracker/yandex-tracker.entity'
import UiPagination from '~/components/ui/UiPagination.vue'

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

const columns = [
  {
    accessorKey: 'name',
    header: 'Наименование задачи'
  },
  {
    accessorKey: 'time',
    header: 'Потраченное время'
  },
  {
    accessorKey: 'dateCreatedAt',
    header: 'Дата'
  },
  {
    accessorKey: 'timeCreatedAt',
    header: 'Время'
  },
  {
    accessorKey: 'comment',
    header: 'Комментарий'
  }
]
</script>

<template>
  <u-table
    :data="rows"
    :columns="columns"
    :ui="{
      thead: 'whitespace-nowrap w-fit [&:nth-child(2)]:max-w-[200px]'
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
        color="secondary"
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

  <ui-pagination
    v-model="page"
    :total="rows.length"
    color="violet"
  />
</template>
