<script setup lang="ts">
import IssueItem from '~/core/components/issues/issue-item.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'

const { overEstimationIssues, totalOverageHours, isLoading } = storeToRefs(useMonthlyReportStore())
</script>

<template>
  <ui-card>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <span class="font-medium">Задачи с превышением оценки</span>
        <u-badge
          v-if="!isLoading && overEstimationIssues.length"
          :label="`Итого перерасход: ${pluralize(totalOverageHours, HOURS_PLURALIZE)}`"
          color="error"
          variant="subtle"
        />
      </div>
    </template>
    <u-skeleton
      v-if="isLoading"
      class="h-48 w-full"
    />
    <ui-empty-state
      v-else-if="!overEstimationIssues.length"
      title="Нет задач с превышением оценки"
    />
    <div
      v-else
      class="flex flex-col divide-y divide-default"
    >
      <issue-item
        v-for="stat in overEstimationIssues"
        :key="stat.issue.id"
        :issue="stat.issue"
        :spent-hours="stat.spentHours"
        :display="{ priority: false, status: false, estimation: true }"
      />
    </div>
  </ui-card>
</template>
