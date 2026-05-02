<script setup lang="ts">
import { useMyIssuesStore, PAGE_SIZE } from '../store/use-my-issues-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import UiPagination from '~/core/components/ui/ui-pagination.vue'
import IssueTimerButton from '~/core/components/issues/issue-timer-button.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { ISSUE_STATUS_OPTIONS, ISSUE_PRIORITY_OPTIONS } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import IssueItem from '~/core/components/issues/issue-item.vue'

useHead({ title: SITEMAP.myIssues.name })

const store = useMyIssuesStore()
const { issuesByQueue, filters, totalIssues, isLoading } = storeToRefs(store)

const { myIssues } = storeToRefs(useSiteSettingsStore())

const statusesModel = computed({
  get: () => ISSUE_STATUS_OPTIONS.filter(o => filters.value.statuses.includes(o.value)),
  set: val => {
    filters.value.statuses = val.map(o => o.value)
  }
})

const priorityModel = computed({
  get: () => filters.value.priority,
  set: (v: string | null) => {
    filters.value.priority = v
  }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">{{ SITEMAP.myIssues.name }}</h1>
      <div class="flex items-center gap-2">
        <u-badge
          v-if="!isLoading && totalIssues > 0"
          :label="`Всего: ${totalIssues}`"
          color="primary"
          variant="subtle"
        />
        <u-button
          :icon="HEROICONS.ARROW_PATH"
          variant="ghost"
          size="sm"
          square
          :loading="isLoading"
          @click="store.refresh()"
        />
      </div>
    </div>

    <ui-card title="Фильтрация">
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <p class="mb-1.5 text-xs font-medium text-muted">Статус</p>
          <u-select-menu
            v-model="statusesModel"
            :items="ISSUE_STATUS_OPTIONS"
            multiple
            class="w-56"
            placeholder="Выберите статусы"
          />
        </div>
        <div class="w-44 shrink-0">
          <p class="mb-1.5 text-xs font-medium text-muted">Приоритет</p>
          <u-select
            v-model="priorityModel"
            :items="ISSUE_PRIORITY_OPTIONS"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </div>
        <u-button
          label="Применить"
          size="md"
          :loading="isLoading"
          @click="store.applyFilters()"
        />
      </div>
    </ui-card>

    <template v-if="isLoading">
      <ui-card
        v-for="i in 3"
        :key="i"
      >
        <u-skeleton class="h-32 w-full" />
      </ui-card>
    </template>

    <ui-empty-state
      v-else-if="!isLoading && totalIssues === 0"
      title="Нет задач"
    />

    <template v-else>
      <ui-card
        v-for="(queueIssues, queueName) in issuesByQueue"
        :key="queueName"
      >
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <span class="text-lg font-bold">{{ queueName }}</span>
            <u-badge
              :label="String(queueIssues.length)"
              color="info"
              variant="subtle"
              size="md"
            />
          </div>
        </template>

        <div class="flex flex-col">
          <issue-item
            v-for="issue in queueIssues"
            :key="issue.key"
            :issue="issue"
            :display="myIssues.display"
          >
            <template #action>
              <issue-timer-button :issue="issue" />
            </template>
          </issue-item>
        </div>
      </ui-card>
    </template>

    <ui-pagination
      v-if="!isLoading && totalIssues > PAGE_SIZE"
      v-model="store.page"
      :total="totalIssues"
      :page-count="PAGE_SIZE"
    />
  </div>
</template>
