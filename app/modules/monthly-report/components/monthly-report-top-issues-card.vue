<script setup lang="ts">
import IssueItem from '~/core/components/issues/issue-item.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'

const { topIssuesByHours, isLoading } = storeToRefs(useMonthlyReportStore())
</script>

<template>
  <ui-card title="Топ-5 задач по времени">
    <u-skeleton
      v-if="isLoading"
      class="h-48 w-full"
    />
    <ui-empty-state v-else-if="!topIssuesByHours.length" />
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
  </ui-card>
</template>
