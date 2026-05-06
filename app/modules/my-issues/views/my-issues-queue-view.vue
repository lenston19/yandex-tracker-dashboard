<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useMyIssuesQueueStore, PAGE_SIZE } from '../store/use-my-issues-queue-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import UiPagination from '~/core/components/ui/ui-pagination.vue'
import IssueTimerButton from '~/core/components/issues/issue-timer-button.vue'
import IssueItem from '~/core/components/issues/issue-item.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { ISSUE_STATUS_OPTIONS, ISSUE_PRIORITY_OPTIONS } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'

const route = useRoute()
const queueKey = computed(() => String(route.params.queue ?? ''))

useHead({ title: computed(() => `${queueKey.value} — ${SITEMAP.myIssues.name}`) })

const store = useMyIssuesQueueStore()
const { paginatedIssues, filters, search, totalIssues, isLoading } = storeToRefs(store)

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

const searchInput = ref('')
const updateSearch = useDebounceFn((val: string) => {
  store.search = val
  store.page = 1
}, 300)
watch(searchInput, updateSearch)
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

        <div class="flex items-end">
          <u-button
            label="Применить"
            size="md"
            :loading="isLoading"
            @click="store.applyFilters()"
          />
        </div>
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
