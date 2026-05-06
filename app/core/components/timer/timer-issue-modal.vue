<script setup lang="ts">
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useIssueSearch } from '~/core/composables/use-issue-search'
import { HEROICONS } from '~/core/constants/heroicons'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import UiEmptyState from '../ui/ui-empty-state.vue'
import IssueItem from '../issues/issue-item.vue'

const modelValue = defineModel<boolean>({ default: false })
const emit = defineEmits<{ select: [issue: Yandex.Issue] }>()

const { query, myOnly, results, isLoading } = useIssueSearch()

const select = (issue: Yandex.Issue) => {
  emit('select', issue)
  modelValue.value = false
}
</script>

<template>
  <modal-base v-model="modelValue">
    <ui-card class="min-w-88">
      <template #header>
        <div class="text-lg font-semibold">Выберите задачу</div>
      </template>

      <div class="flex min-h-50 flex-col gap-3">
        <div class="flex flex-col gap-3">
          <u-input
            v-model="query"
            placeholder="Поиск по ключу или названию..."
            :loading="isLoading"
            :icon="HEROICONS.MAGNIFYING_GLASS"
            autofocus
            class="flex-1"
          />

          <u-switch
            v-model="myOnly"
            :checked-icon="HEROICONS.CHECK_20_SOLID"
            :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
            label="Только мои задачи"
          />
        </div>

        <div
          v-if="results.length"
          class="flex max-h-100 flex-col gap-2 overflow-y-auto"
        >
          <u-button
            v-for="issue in results"
            :key="issue.key"
            class="w-full py-0 sm:py-0"
            color="neutral"
            variant="subtle"
            @click="select(issue)"
          >
            <issue-item
              :issue="issue"
              :display="{ assignee: true, reviewer: true, qaEngineer: true }"
            />
          </u-button>
        </div>

        <ui-empty-state
          v-else-if="query && !isLoading"
          class="my-auto"
        />

        <ui-empty-state
          v-else
          class="my-auto"
          title="Введите ключ задачи или название"
        />
      </div>
    </ui-card>
  </modal-base>
</template>
