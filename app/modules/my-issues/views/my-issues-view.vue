<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useMyIssuesStore } from '../store/use-my-issues-store'
import { useQueuesStore } from '~/core/store/use-queues-store'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import IssueTimerButton from '~/core/components/issues/issue-timer-button.vue'
import IssueItem from '~/core/components/issues/issue-item.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { AppRoutes } from '~/core/utils/router/types'
import { ISSUE_STATUS_OPTIONS, ISSUE_PRIORITY_OPTIONS } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'

useHead({ title: SITEMAP.myIssues.name })

const store = useMyIssuesStore()
const { issuesByQueue, issueTotalByQueue, filters, search, totalIssues, filteredTotal, isLoading } = storeToRefs(store)

const { myIssues } = storeToRefs(useSiteSettingsStore())
const { queuesModel } = storeToRefs(useQueuesStore())

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

const queueModel = computed({
  get: () => queuesModel.value.find(q => q.key === filters.value.queue),
  set: (q: Yandex.Queue | undefined) => {
    filters.value.queue = q?.key ?? ''
  }
})

const searchInput = ref('')
const updateSearch = useDebounceFn((val: string) => {
  store.search = val
}, 300)
watch(searchInput, updateSearch)

const getQueueRoute = (queueKey: string) => ({
  name: AppRoutes.myIssuesQueue,
  params: { queue: queueKey }
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
          :loading="isLoading"
          @click="store.refresh()"
        />
      </div>
    </div>

    <ui-card title="Фильтрация">
      <div class="flex flex-wrap items-end gap-4">
        <u-form-field label="Поиск">
          <u-input
            v-model="searchInput"
            placeholder="Название или ключ задачи"
            class="w-64"
            :trailing-icon="searchInput ? undefined : HEROICONS.MAGNIFYING_GLASS"
          >
            <template
              v-if="searchInput"
              #trailing
            >
              <u-button
                :icon="HEROICONS.X_MARK"
                variant="ghost"
                size="xs"
                square
                @click="searchInput = ''"
              />
            </template>
          </u-input>
        </u-form-field>

        <u-form-field label="Статус">
          <u-select-menu
            v-model="statusesModel"
            :items="ISSUE_STATUS_OPTIONS"
            multiple
            class="w-56"
            placeholder="Выберите статусы"
          />
        </u-form-field>

        <u-form-field label="Приоритет">
          <u-select
            v-model="priorityModel"
            :items="ISSUE_PRIORITY_OPTIONS"
            value-key="value"
            label-key="label"
            class="w-44"
          />
        </u-form-field>

        <u-form-field label="Очередь">
          <u-select-menu
            v-model="queueModel"
            :items="queuesModel"
            label-key="name"
            class="w-56"
            placeholder="Все очереди"
          />
        </u-form-field>

        <div class="flex items-end gap-2">
          <u-button
            label="Применить"
            size="md"
            :loading="isLoading"
            @click="store.applyFilters()"
          />
          <u-button
            v-if="queueModel"
            label="Сбросить очередь"
            size="md"
            variant="ghost"
            :disabled="isLoading"
            @click="queueModel = undefined"
          />
        </div>
      </div>
    </ui-card>

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
      v-else-if="!isLoading && filteredTotal === 0"
      title="Нет задач"
    />

    <div
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <ui-card
        v-for="(queueIssues, queueKey) in issuesByQueue"
        :key="queueKey"
        class="flex flex-col"
      >
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <span class="text-lg font-bold">{{ queueIssues[0]?.queue.display ?? queueKey }}</span>
            <u-badge
              :label="String(issueTotalByQueue[queueKey])"
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
            :highlight-query="search"
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
            :to="getQueueRoute(String(queueKey))"
            :trailing-icon="HEROICONS.ARROW_RIGHT"
          />
        </template>
      </ui-card>
    </div>
  </div>
</template>
