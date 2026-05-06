<script setup lang="ts">
import { useMyIssuesQueueStore, PAGE_SIZE } from '../store/use-my-issues-queue-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import UiPagination from '~/core/components/ui/ui-pagination.vue'
import IssueTimerButton from '~/core/components/issues/issue-timer-button.vue'
import IssueItem from '~/core/components/issues/issue-item.vue'
import MyIssuesFilters from '../components/my-issues-filters.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'

const route = useRoute()
const queueKey = computed(() => String(route.params.queue ?? ''))

useHead({ title: computed(() => `${queueKey.value} — ${SITEMAP.myIssues.name}`) })

const store = useMyIssuesQueueStore()
const { paginatedIssues, filters, search, totalIssues, isLoading } = storeToRefs(store)

const { myIssues } = storeToRefs(useSiteSettingsStore())

watch(search, () => {
  store.page = 1
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <u-button
          :to="SITEMAP.myIssues.route"
          :icon="HEROICONS.ARROW_LEFT"
          variant="ghost"
          size="sm"
          square
        />
        <h1 class="text-2xl font-semibold">{{ queueKey }}</h1>
      </div>
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

    <my-issues-filters
      v-model:statuses="filters.statuses"
      v-model:priority="filters.priority"
      v-model:search="store.search"
      :is-loading="isLoading"
      @apply="store.applyFilters()"
    />

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
      <ui-card>
        <div class="flex flex-col">
          <issue-item
            v-for="issue in paginatedIssues"
            :key="issue.key"
            :issue="issue"
            :display="myIssues.display"
            :highlight-query="search"
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
