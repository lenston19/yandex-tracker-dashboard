<script setup lang="ts">
import { parseISO } from 'date-fns'
import { useModal } from 'vue-final-modal'
import { calculateWorklogTimeByDay } from '../../utils/time'
import type { Yandex } from '../../types/api/yandex-tracker/yandex-tracker.entity'
import UiPagination from '../ui/ui-pagination.vue'
import UiCard from '../ui/ui-card.vue'
import { useDateFormatter } from '../../composables/use-date-formatter'
import yandexTrackerApi from '../../api/yandex-tracker.api'
import { useTryCatchWithLoading } from '../../composables/use-try-catch-with-loading'
import { HEROICONS } from '../../constants/heroicons'
import { AsyncModalConfirm } from '../modal'
import { WORKLOG_COLUMNS } from '~/core/constants/worklogs'
import { useWorklogBus } from '../../composables/use-worklog-bus'

const props = defineProps<{
  worklogs: Yandex.Worklog[]
}>()

const { formatShortDate, formatTime } = useDateFormatter()

const getKey = (row: Yandex.Worklog) => row.issue.key
const getName = (row: Yandex.Worklog) => row.issue.display
const getTime = (row: Yandex.Worklog) => calculateWorklogTimeByDay(row)
const getDateCreatedAt = (row: Yandex.Worklog) => formatShortDate(parseISO(row.start))
const getTimeCreatedAt = (row: Yandex.Worklog) => formatTime(parseISO(row.start))

const page = ref<number>(1)
const pageCount = 5
const rows = computed(() => props.worklogs.slice((page.value - 1) * pageCount, page.value * pageCount))

const pendingDelete = ref<Yandex.Worklog | null>(null)

const {
  open: openConfirmModal,
  close: closeConfirmModal,
  patchOptions: patchConfirmModal
} = useModal({ component: AsyncModalConfirm })

const { runWithLoading: confirmDelete, isLoading: isConfirmDeleting } = useTryCatchWithLoading(async () => {
  if (!pendingDelete.value) return
  const deletedId = pendingDelete.value.id
  await yandexTrackerApi.worklogDelete(pendingDelete.value.issue.key, deletedId)
  await closeConfirmModal()
  pendingDelete.value = null
  useWorklogBus().emit('deleted', deletedId)
})

watch(isConfirmDeleting, loading => {
  patchConfirmModal({ attrs: { loading } })
})

const openConfirm = (worklog: Yandex.Worklog) => {
  pendingDelete.value = worklog
  patchConfirmModal({
    attrs: {
      title: 'Удалить ворклог?',
      description: 'Это действие необратимо.',
      confirmLabel: 'Удалить',
      loading: false,
      onConfirm: confirmDelete
    }
  })
  openConfirmModal()
}
</script>

<template>
  <ui-card :ui="{ body: 'p-0 sm:p-0' }">
    <u-table
      :data="rows"
      :columns="WORKLOG_COLUMNS"
      :ui="{
        thead: 'whitespace-nowrap w-fit',
        td: 'first:whitespace-pre-wrap last:whitespace-pre-wrap w-fit first:w-80 last:w-50',
        th: 'first:whitespace-pre-wrap last:whitespace-pre-wrap w-fit first:w-80 last:w-50'
      }"
    >
      <template #key-cell="{ row }">
        <u-link
          :to="`https://tracker.yandex.ru/${getKey(row.original)}`"
          target="_blank"
          class="font-mono text-primary hover:underline"
        >
          {{ getKey(row.original) }}
        </u-link>
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
      <template #actions-cell="{ row }">
        <u-tooltip
          text="Удалить"
          :delay-duration="0"
        >
          <u-button
            :icon="HEROICONS.TRASH"
            variant="ghost"
            size="sm"
            square
            color="error"
            @click="openConfirm(row.original)"
          />
        </u-tooltip>
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
