<script setup lang="ts">
import IssueItem from '~/core/components/issues/issue-item.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { HEROICONS } from '~/core/constants/heroicons'

const ACCURACY_GOOD_THRESHOLD = 70

const TABS = [
  { value: 'hours', label: 'Топ 5', icon: HEROICONS.CLOCK },
  { value: 'estimation', label: 'Превышение оценки', icon: HEROICONS.EXCLAMATION_TRIANGLE }
]

const activeTab = ref('hours')

const { topIssuesByHours, overEstimationIssues, totalOverageHours, accuracyByQueue, isLoading } =
  storeToRefs(useMonthlyReportStore())
</script>

<template>
  <ui-card title="Задачи месяца">
    <u-tabs
      v-model="activeTab"
      :items="TABS"
      variant="pill"
      size="sm"
      :content="false"
      class="mb-4"
    />

    <u-skeleton
      v-if="isLoading"
      class="h-48 w-full"
    />

    <template v-else-if="activeTab === 'hours'">
      <ui-empty-state v-if="!topIssuesByHours.length" />
      <div
        v-else
        class="flex flex-col divide-y divide-default"
      >
        <issue-item
          v-for="stat in topIssuesByHours"
          :key="stat.issue.id"
          :issue="stat.issue"
          :display="{ priority: false, status: false, estimation: false }"
        >
          <template #action>
            <u-badge
              :label="pluralize(stat.hours, HOURS_PLURALIZE)"
              color="secondary"
              variant="subtle"
              class="shrink-0 self-center"
            />
          </template>
        </issue-item>
      </div>
    </template>

    <template v-else>
      <ui-empty-state
        v-if="!accuracyByQueue.length"
        title="Нет оценённых задач"
      />
      <div
        v-else
        class="mb-5 space-y-4"
      >
        <div
          v-for="stat in accuracyByQueue.slice(0, 4)"
          :key="stat.queueKey"
          class="space-y-1"
        >
          <div class="flex items-baseline justify-between text-sm">
            <span class="font-medium text-highlighted">{{ stat.queueName }}</span>
            <span class="text-muted">{{ stat.percent }}%</span>
          </div>
          <u-progress
            :model-value="stat.percent"
            :max="100"
            :color="stat.percent >= ACCURACY_GOOD_THRESHOLD ? 'success' : 'error'"
            size="sm"
          />
        </div>
      </div>

      <div
        v-if="overEstimationIssues.length"
        class="mb-4 flex items-center justify-between border-t border-default pt-4 text-sm text-muted"
      >
        <span>Больше всего превышают оценку</span>
        <u-badge
          :label="`+${pluralize(totalOverageHours, HOURS_PLURALIZE)}`"
          color="error"
          variant="subtle"
          size="sm"
        />
      </div>

      <ui-empty-state
        v-if="!overEstimationIssues.length"
        title="Нет задач с превышением оценки"
      />
      <div
        v-else
        class="flex flex-col divide-y divide-default"
      >
        <issue-item
          v-for="stat in overEstimationIssues.slice(0, 5)"
          :key="stat.issue.id"
          :issue="stat.issue"
          :spent-hours="stat.spentHours"
          :display="{ priority: false, status: false, estimation: true }"
        />
      </div>
    </template>
  </ui-card>
</template>
