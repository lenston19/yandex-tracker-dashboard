<script setup lang="ts">
import { useMyIssuesStore } from '../store/use-my-issues-store'
import { useQueuesStore } from '~/core/store/use-queues-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import IssueTimerButton from '~/core/components/issues/issue-timer-button.vue'
import IssueItem from '~/core/components/issues/issue-item.vue'
import MyIssuesFilters from '../components/my-issues-filters.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { AppRoutes } from '~/core/utils/router/types'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { filterQueueItemsWithIssues } from '~/core/utils/my-issues'

useHead({ title: SITEMAP.myIssues.name })

const store = useMyIssuesStore()
const { queueItems, selectedQueues, issueSpentHoursMap, filters, search, totalIssues, filteredTotal, isLoading } =
  storeToRefs(store)

const { myIssues } = storeToRefs(useSiteSettingsStore())
const { queuesModel } = storeToRefs(useQueuesStore())

const visibleQueueItems = computed(() => filterQueueItemsWithIssues(queueItems.value))

const selectedQueueModels = computed({
  get: () => queuesModel.value.filter(queue => selectedQueues.value.includes(queue.key)),
  set: queues => {
    selectedQueues.value = queues.map(queue => queue.key)
  }
})

const getQueueRoute = (queueKey: string) => ({
  name: AppRoutes.myIssuesQueue,
  params: { queue: queueKey },
  query: {
    ...(filters.value.statuses.length ? { statuses: filters.value.statuses.join(',') } : {}),
    ...(filters.value.priority ? { priority: filters.value.priority } : {}),
    ...(search.value ? { search: search.value } : {})
  }
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">{{ SITEMAP.myIssues.name }}</h1>
      <div class="flex items-center gap-2">
        <u-badge
          v-if="!isLoading && filteredTotal > 0"
          :label="search ? `${filteredTotal} из ${totalIssues}` : `Всего: ${totalIssues}`"
          color="primary"
          variant="subtle"
        />
        <u-button
          :icon="HEROICONS.ARROW_PATH"
          variant="ghost"
          size="sm"
          square
          aria-label="Обновить список"
          :loading="isLoading"
          @click="store.refresh()"
        />
      </div>
    </div>

    <my-issues-filters
      v-model:statuses="filters.statuses"
      v-model:priority="filters.priority"
      v-model:search="store.search"
      :is-loading="isLoading"
      @apply="store.applyFilters()"
    >
      <template #extra>
        <u-form-field
          label="Очереди"
          class="w-full lg:w-56"
        >
          <u-select-menu
            v-model="selectedQueueModels"
            :items="queuesModel"
            label-key="name"
            multiple
            class="w-full"
            placeholder="Выберите очереди"
          />
        </u-form-field>
      </template>
      <template #actions>
        <u-button
          v-if="selectedQueues.length"
          label="Сбросить очереди"
          size="md"
          variant="ghost"
          :disabled="isLoading"
          @click="selectedQueues = []"
        />
      </template>
    </my-issues-filters>

    <template v-if="isLoading">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ui-card
          v-for="i in 6"
          :key="i"
        >
          <u-skeleton class="h-40 w-full" />
        </ui-card>
      </div>
    </template>

    <ui-empty-state
      v-else-if="!selectedQueues.length"
      title="Выберите очереди"
    />

    <ui-empty-state
      v-else-if="!visibleQueueItems.length"
      title="Нет задач по выбранным фильтрам"
    />

    <div
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <ui-card
        v-for="item in visibleQueueItems"
        :key="item.key"
        class="flex flex-col"
      >
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <span class="text-lg font-bold">{{
              queuesModel.find(queue => queue.key === item.key)?.name ?? item.key
            }}</span>
            <u-badge
              :label="String(item.state.totalCount)"
              color="info"
              variant="subtle"
              size="md"
            />
          </div>
        </template>

        <ui-empty-state
          v-if="item.state.issues.length === 0"
          title="Нет задач по выбранным фильтрам"
        />

        <div
          v-else
          class="flex flex-col"
        >
          <issue-item
            v-for="issue in item.state.issues"
            :key="issue.key"
            :issue="issue"
            :display="myIssues.display"
            :highlight-query="search"
            :spent-hours="issueSpentHoursMap.get(issue.key) ?? null"
          >
            <template #action>
              <issue-timer-button :issue="issue" />
            </template>
          </issue-item>
        </div>

        <template #footer>
          <u-button
            label="Все задачи"
            variant="ghost"
            size="sm"
            :to="getQueueRoute(item.key)"
            :trailing-icon="HEROICONS.ARROW_RIGHT"
          />
        </template>
      </ui-card>
    </div>
  </div>
</template>
