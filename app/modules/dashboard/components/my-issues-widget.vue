<script setup lang="ts">
import { useMyIssuesWidgetStore } from '../store/use-my-issues-widget-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import IssueTimerButton from '~/core/components/issues/issue-timer-button.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import IssueItem from '~/core/components/issues/issue-item.vue'

const PAGE_SIZE = 5

const store = useMyIssuesWidgetStore()
const { issues, issueSpentHoursMap, isLoading } = storeToRefs(store)

const { myIssues } = storeToRefs(useSiteSettingsStore())

const page = ref(1)

const totalPages = computed(() => Math.ceil(issues.value.length / PAGE_SIZE) || 1)

const pagedIssues = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return issues.value.slice(start, start + PAGE_SIZE)
})

watch(issues, () => {
  page.value = 1
})
</script>

<template>
  <ui-card>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-lg font-medium">Мои задачи</div>
        <div class="flex items-center gap-2">
          <u-link
            :to="{ name: SITEMAP.myIssues.route.name }"
            class="text-xs text-primary hover:underline"
          >
            Все
          </u-link>
        </div>
      </div>
    </template>

    <div
      v-if="isLoading"
      class="flex flex-col gap-2"
    >
      <u-skeleton
        v-for="i in 3"
        :key="i"
        class="h-10 w-full rounded-lg"
      />
    </div>

    <ui-empty-state
      v-else-if="!isLoading && issues.length === 0"
      title="Нет активных задач"
    />

    <div
      v-else
      class="flex flex-col divide-y divide-neutral-700"
    >
      <issue-item
        v-for="issue in pagedIssues"
        :key="issue.key"
        :issue="issue"
        :display="myIssues.display"
        :spent-hours="issueSpentHoursMap.get(issue.key) ?? null"
      >
        <template #action>
          <issue-timer-button :issue="issue" />
        </template>
      </issue-item>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <div
          v-if="totalPages > 1"
          class="flex items-center gap-1"
        >
          <u-button
            :icon="HEROICONS.ARROW_LEFT"
            variant="ghost"
            size="xs"
            square
            :disabled="page === 1"
            @click="page--"
          />
          <span class="text-xs text-muted">{{ page }} / {{ totalPages }}</span>
          <u-button
            :icon="HEROICONS.ARROW_RIGHT"
            variant="ghost"
            size="xs"
            square
            :disabled="page >= totalPages"
            @click="page++"
          />
        </div>
        <worklog-actions
          class="ml-auto w-fit"
          :refresh="store.refresh"
          :loading="isLoading"
        />
      </div>
    </template>
  </ui-card>
</template>
